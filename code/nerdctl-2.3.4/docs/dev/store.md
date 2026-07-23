# About `pkg/store`

## TL;DR

You _may_ want to read this if you are developing something in nerdctl that would involve storing persistent information.

If there is a "store" already in the codebase (eg: volumestore, namestore, etc) that does provide the methods that you need,
you are fine and should just stick to that.

On the other hand, if you are curious, or if what you want to write is "new", then _you should_ have a look at this document:
it does provide extended information about how we manage persistent data storage, especially with regard to concurrency
and atomicity.

## Motivation

The core of nerdctl aims at keeping its dependencies as lightweight as possible.
For that reason, nerdctl does not use a database to store persistent information, but instead uses the filesystem,
under a variety of directories.

That "information" is typically volumes metadata, containers lifecycle info, the "name store" (which does ensure no two
containers can be named the same), etc.

However, storing data on the filesystem in a reliable way comes with challenges:
- incomplete writes may happen (because of a system restart, or an application crash), leaving important structured files
in a broken state
- concurrent writes, or reading while writing would obviously be a problem as well, be it across goroutines, or between
concurrent executions of the nerdctl binary, or embedded in a third-party application that does concurrently access resources

The `pkg/store` package does provide a "storage" abstraction that takes care of these issues, generally providing
guarantees that concurrent operations can be performed safely, and that writes are "atomic", ensuring we never brick
user installs.

For details about how, and what is done, read-on.

## The problem with writing a file

A write may very well be interrupted.

While reading the resulting mangled file will typically break `json.Unmarshall` for example, and while we should still
handle such cases gracefully and provide meaningful information to the user about which file is damaged (which could be due
to the user manually modifying them), using "atomic" writes will (almost always (*)) prevent this from happening
on our part.

An "atomic" write is usually performed by first writing data to a temporary file, and then, only if the write operation
succeeded, move that temporary file to its final destination.

The `rename` syscall (see https://man7.org/linux/man-pages/man2/rename.2.html) is indeed "atomic"
(eg: it fully succeeds, or fails), providing said guarantees that you end-up with a complete file that has the entirety
of what was meant to be written.

This is an "almost always", as an _operating system crash_ MAY break that promise (this is highly dependent on specifics
that are out of scope here, and that nerdctl has no control over).
Though, crashing operating systems is (hopefully) a sufficiently rare event that we can consider we "always" have atomic writes.

There is one caveat with "rename-based atomic writes" though: if you mount the file itself inside a container,
an atomic write will not work as you expect, as the inode will (obviously) change when you modify the file,
and these changes will not be propagated inside the container.

This caveat is the reason why `hostsstore` does NOT use an atomic write to update the `hosts` file, but a traditional write.

## Concurrency between go routines

This is a (simple) well-known problem. Just use a mutex to prevent concurrent modifications of the same object.

Note that this is not much of a problem right now in nerdctl itself - but it might be in third-party applications using
our codebase.

This is just generally good hygiene when building concurrency-safe packages.

## Concurrency between distinct binary invocations

This is much more of a problem.

There are many good reasons and real-life scenarios where concurrent binary execution may happen.
A third-party deployment tool (similar to terraform for eg), that will batch a bunch of operations to be performed
to achieve a desired infrastructure state, and call many `nerdctl` invocations in parallel to achieve that.
This is also common-place in testing (subpackages).
And of course, a third-party tool that would be long-running and allow parallel execution, leveraging nerdctl codebase
as a library, may certainly produce these circumstances.

The known answer to that problem is to use a filesystem lock (or flock).

Concretely, the first process will "lock" a directory. All other processes trying to do the same will then be put
in a queue and wait for the prior lock to be released before they can "lock" themselves, in turn.

Filesystem locking comes with its own set of challenges:
- implementation is somewhat low-level (the golang core library keeps their implementation internal, and you have to
reimplement your own with platform-dependent APIs and syscalls)
- it is tricky to get right - there are reasons why golang core does not make it public
- locking "scope" should be done carefully: having ONE global lock for everything will definitely hurt performance badly,
as you will basically make everything "sequential", effectively destroying some of the benefits of parallelizing code
in the first place...

## Lock design...

While it is tempting to just provide self-locking, individual methods as an API (`Get`, `Set`), this is not the right
answer.

Imagine a context where consuming code would first like to check if something exists, then later on create it if it does not:
```golang
if !store.Exists("something") {
	// do things
	// ...
	// Now, create
	store.Set([]byte("data"), "something")
}
```

You do have two methods (`Get` and `Set`) that _may individually_ guarantee they are the sole user of that resource,
but a concurrent change _in between_ these two calls may very well (and _will_) happen and change the state of the world.

Effectively, in that case, `Set` might overwrite changes made by another go routine or concurrent execution, possibly
wrecking havoc in another process.

_When_ to lock, and _for how long_, is a decision that only the embedding code can make.

A good example is container creation.
It may require the creation of several different volumes.
In that case, you want to lock at the start of the container creation process, and only release the lock when you are fully
done creating the container - not just when done creating a volume (nor even when done creating all volumes).

## ... while safeguarding the developer

nerdctl still provides some safeguards for the developer.

Any store method that DOES require locking will fail loudly if it does not detect a lock.

This is obviously not bullet-proof.
For example, the lock may belong to another goroutine instead of the one we are in (and we cannot detect that).
But this is still better than nothing, and will help developers making sure they **do** lock.

## Using the `store` api to implement your own storage

While - as mentioned above - the store does _not_ lock on its own, specific "stores implementations" may, and should,
provide higher-level methods that best fit their data-model usage, and that **do** lock on their own.

For example, the namestore (which is the simplest store), does provide three simple methods:
- Acquire
- Release
- Rename

Users of the `namestore` do not have to bother with locking. These methods are safe to use concurrently.

This is a good example of how to leverage core store primitives to implement a developer friendly, safe storage for
"something" (in that case "names").

Finaly note an important point - mentioned above: locking should be done to the smallest possible "segment" of sub-directories.
Specifically, any store should lock only - at most - resources under the _namespace_ being manipulated.

For example, a container lifecycle storage should not lock out any other container, but only its own private directory.

## Scope, ambitions and future

`pkg/store` has no ambition whatsoever to be a generic solution, usable outside nerdctl.

It is solely designed to fit nerdctl needs, and if it was to be made usable standalone, would probably have to be modified
extensively, which is clearly out of scope here.

Furthermore, there are already much more advanced generic solutions out there that you should use instead for outside-of-nerdctl projects.

As for future, one nice thing we should consider is to implement read-only locks in addition to the exclusive, write-locks
we currently use.
The net benefit would be a performance boost in certain contexts (massively parallel, mostly read environments).
## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
