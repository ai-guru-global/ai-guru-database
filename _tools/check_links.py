#!/usr/bin/env python3
"""Check for broken relative links in Markdown files."""
import re
import os
import sys

def find_broken_links(base_dir):
    exclude = {'.git', 'Web', 'synthesis', '_archives', '_raw', '_staging',
               'node_modules', '.venv', '.qoder', '.obsidian', '.github'}

    broken = []
    total_links = 0
    files_checked = 0

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in exclude and not d.startswith('.')]
        for fname in files:
            if not fname.endswith('.md'):
                continue
            filepath = os.path.join(root, fname)
            files_checked += 1

            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # Find markdown links: [text](path)
            for match in re.finditer(r'\[([^\]]*)\]\(([^)]+)\)', content):
                link_text = match.group(1)
                link_path = match.group(2)

                # Skip external URLs
                if link_path.startswith(('http://', 'https://', 'mailto:', '#', 'ftp://')):
                    continue

                total_links += 1

                # Resolve relative path
                link_clean = link_path.split('#')[0].split('?')[0]
                if not link_clean:
                    continue

                target = os.path.normpath(os.path.join(root, link_clean))

                # Check if target exists (as file or directory)
                if not os.path.exists(target):
                    # Try with .md extension
                    if not target.endswith('.md') and os.path.exists(target + '.md'):
                        continue
                    rel_source = os.path.relpath(filepath, base_dir)
                    broken.append((rel_source, link_text, link_path))

    return broken, total_links, files_checked


if __name__ == '__main__':
    base = sys.argv[1] if len(sys.argv) > 1 else '.'
    broken, total, files = find_broken_links(base)

    print(f"Checked {files} files, {total} internal links")
    print(f"Found {len(broken)} broken links:\n")

    for source, text, path in sorted(broken):
        print(f"  {source}")
        print(f"    [{text}]({path})")
        print()
