#!/usr/bin/env bash

find app -maxdepth 3 | egrep -v '(node_modules|assets|.ts|.map|DS_Store)' | sed -e 's;[^/]*/;## ;g;s; ##;#;g' > file-tree.md


# 从文件夹生成目录树 md格式，可导入到xmind
