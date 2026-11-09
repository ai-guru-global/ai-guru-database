//go:build windows

package cmd

import (
	"syscall"
	"unsafe"
)

func init() {
	// 设置 Windows 控制台代码页为 UTF-8 (65001)
	kernel32 := syscall.NewLazyDLL("kernel32.dll")
	setConsoleOutputCP := kernel32.NewProc("SetConsoleOutputCP")
	setConsoleCP := kernel32.NewProc("SetConsoleCP")

	// 设置输出和输入代码页为 UTF-8
	const CP_UTF8 = 65001
	setConsoleOutputCP.Call(uintptr(CP_UTF8))
	setConsoleCP.Call(uintptr(CP_UTF8))

	// 启用虚拟终端处理以支持 ANSI 颜色代码
	setConsoleMode := kernel32.NewProc("SetConsoleMode")
	getStdHandle := kernel32.NewProc("GetStdHandle")

	const (
		STD_OUTPUT_HANDLE                  = ^uintptr(10) // -11
		ENABLE_VIRTUAL_TERMINAL_PROCESSING = 0x0004
	)

	handle, _, _ := getStdHandle.Call(STD_OUTPUT_HANDLE)
	if handle != 0 && handle != ^uintptr(0) {
		var mode uint32
		getConsoleMode := kernel32.NewProc("GetConsoleMode")
		getConsoleMode.Call(handle, uintptr(unsafe.Pointer(&mode)))
		mode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING
		setConsoleMode.Call(handle, uintptr(mode))
	}
}
