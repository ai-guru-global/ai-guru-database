#!/usr/bin/env python3
"""DEPRECATED shim — kept for backward compatibility.

This now delegates to the unified `_tools/export_corpus.py --scope full`.
The full-wiki logic (robust resolver, transitive reachability, link rewriting)
lives there now. Run either:

    python3 _tools/export_corpus_full.py --output release --clean
    # equivalent to:
    python3 _tools/export_corpus.py --scope full --output release --clean
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    # Inject --scope full in front of user args, then dispatch to the real main.
    sys.argv = [sys.argv[0], "--scope", "full"] + sys.argv[1:]
    from export_corpus import main
    main()
