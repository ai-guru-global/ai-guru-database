#!/usr/bin/env python3
"""
Cloud Agent Evaluation Framework - Main Entry Point
=====================================================
Usage:
    python run_evaluation.py                    # Run full evaluation (simulation)
    python run_evaluation.py --config custom.yaml  # Use custom config
    python run_evaluation.py --quick            # Quick evaluation (fewer samples)

Requires: Python 3.11+, pip install -r requirements.txt
"""

import argparse
import asyncio
import sys
from pathlib import Path

# Add parent to path for package imports
sys.path.insert(0, str(Path(__file__).parent))

from evaluator.core import EvaluationPipeline


def main():
    parser = argparse.ArgumentParser(
        description="Cloud Agent Evaluation Framework"
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Path to config YAML file (default: config.yaml)"
    )
    parser.add_argument(
        "--quick", action="store_true",
        help="Quick evaluation with fewer samples"
    )
    args = parser.parse_args()

    pipeline = EvaluationPipeline(config_path=args.config)

    if args.quick:
        # Reduce dataset sizes for quick run
        for key in pipeline.config.get("datasets", {}):
            pass  # Pipeline already limits samples in evaluation

    result = asyncio.run(pipeline.run())

    print(f"\nEvaluation complete. {result['metadata']['total_agents']} agents evaluated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
