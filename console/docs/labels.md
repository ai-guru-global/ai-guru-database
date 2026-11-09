# GitHub Labels

Issue 模板与 `publish_issues.py` 会用到以下标签。首次启用时在仓库根运行一次（需要 `gh` 已登录、有 admin 权限）：

```bash
gh label create "good first issue" --color 7057ff --description "低门槛，适合第一次贡献" --force
gh label create "数据修正" --color d4c5f9 --description "错字 / 断链 / 格式修正" --force
gh label create "核验" --color fbca04 --description "六态核验台账相关" --force
gh label create "来源" --color 0e8a16 --description "补来源 / 认领薄弱节点" --force
gh label create "线索投稿" --color 1d76db --description "新建或补充线索" --force
gh label create "结构提案" --color b60205 --description "新增 / 调整产业链节点" --force
```

检查：

```bash
gh label list
```

`publish_issues.py` 默认 dry-run；确认标签存在后再加 `--yes` 实际创建：

```bash
python3 tools/scripts/publish_issues.py --kind thin --limit 5 --yes
```