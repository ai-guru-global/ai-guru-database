#!/usr/bin/env python3
"""Promote key work-order agent pages to tier: core and add missing tiers.

In LLM-Wiki mode, wiki-context-pack packs tier:core pages first into token budget.
Work-order critical pages must be core so the agent gets them in context priority.
"""
import os, re, sys

# Pages that must be tier: core for the work-order agent
PROMOTE_TO_CORE = [
    # K8s troubleshooting core
    "13_AI_Ops/Kubernetes_Troubleshooting_Playbook.md",
    "12_Architecture_Infrastructure/Alibaba_Cloud_Proprietary_K8s_Context.md",
    "12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive.md",
    "12_Architecture_Infrastructure/Kubernetes_Networking_Deep_Dive.md",
    "12_Architecture_Infrastructure/Kubernetes_Storage_Deep_Dive.md",
    "12_Architecture_Infrastructure/Kubernetes_Observability_Stack.md",
    # AI workload runbooks
    "13_AI_Ops/SRE_Reliability/GPU_OOM_Troubleshooting_Guide.md",
    "13_AI_Ops/SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook.md",
    "13_AI_Ops/SRE_Reliability/K8s_AI_Troubleshooting_Cheat_Sheet.md",
    "13_AI_Ops/SRE_Reliability/HAMi_Troubleshooting_Guide.md",
    "07_Model_Training/Monitoring/LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s.md",
    "07_Model_Training/Distributed_Training/Distributed_Training_Hang_Runbook.md",
    "10_Deployment_Inference/Model_Hot_Reload_and_Rollback_Runbook.md",
    # Alibaba Cloud AI Stack core context
    "12_Architecture_Infrastructure/AI_Stack/AI_Stack_Deep_Dive.md",
    "12_Architecture_Infrastructure/AI_Stack/HAMi_Deep_Dive.md",
    "12_Architecture_Infrastructure/Cloud_Providers/Alibaba_Cloud_AI_Stack_Deep_Dive.md",
    "12_Architecture_Infrastructure/Cloud_Providers/Alibaba_PAI_Deep_Dive.md",
]

# Cloud_Ops_Agent files missing tier entirely
ADD_TIER_CORE = [
    "_projects/Cloud_Ops_Agent/README.md",
    "_projects/Cloud_Ops_Agent/Cloud_Product_Ops_2026.md",
    "_projects/Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy.md",
    "_projects/Cloud_Ops_Agent/CloudOps-in-nutshell.md",
    "_projects/Cloud_Ops_Agent/docs/corpus/index.md",
    "_projects/Cloud_Ops_Agent/docs/corpus/alicloud-proprietary-k8s-agent-corpus-plan.md",
    "_projects/Cloud_Ops_Agent/docs/architecture/index.md",
]

ADD_TIER_SUPPORTING = [
    "_projects/Cloud_Ops_Agent/Java_Cloud_SDK_Guide.md",
    "_projects/Cloud_Ops_Agent/Mobile_AI_Ops_Design.md",
    "_projects/Cloud_Ops_Agent/README_for_dummy.md",
    "_projects/Cloud_Ops_Agent/docs/index.md",
    "_projects/Cloud_Ops_Agent/docs/integration_testing/index.md",
    "_projects/Cloud_Ops_Agent/docs/development/index.md",
    "_projects/Cloud_Ops_Agent/docs/product/index.md",
    "_projects/Cloud_Ops_Agent/docs/operations/index.md",
    "_projects/Cloud_Ops_Agent/docs/testing/index.md",
    "_projects/Cloud_Ops_Agent/docs/templates/test_template.md",
    "_projects/Cloud_Ops_Agent/docs/templates/dev_template.md",
    "_projects/Cloud_Ops_Agent/docs/templates/arch_template.md",
    "_projects/Cloud_Ops_Agent/docs/templates/ops_template.md",
]

def set_tier(filepath, tier):
    """Set or add tier in frontmatter."""
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {filepath}")
        return False
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Check if frontmatter exists
    if not content.startswith('---'):
        print(f"  SKIP (no frontmatter): {filepath}")
        return False
    # Check if tier exists
    tier_pattern = re.compile(r'^(tier\s*:\s*)"?(\w+)"?\s*$', re.MULTILINE)
    m = tier_pattern.search(content)
    if m:
        old_tier = m.group(2)
        if old_tier == tier:
            return False  # Already correct
        # Replace existing tier
        old_line = m.group(0)
        new_line = f'tier: {tier}'
        content = content.replace(old_line, new_line, 1)
    else:
        # Add tier after the updated: line or before closing ---
        if re.search(r'^updated\s*:', content, re.MULTILINE):
            content = re.sub(
                r'(^updated\s*:.*$)',
                r'\1\ntier: ' + tier,
                content,
                count=1,
                flags=re.MULTILINE
            )
        else:
            # Add before closing ---
            content = content.replace('---\n', f'tier: {tier}\n---\n', 1)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

def main():
    promoted = 0
    added = 0
    print("=== Promoting to tier: core ===")
    for f in PROMOTE_TO_CORE:
        if set_tier(f, 'core'):
            print(f"  PROMOTED: {f}")
            promoted += 1
    print(f"\n=== Adding tier: core (was missing) ===")
    for f in ADD_TIER_CORE:
        if set_tier(f, 'core'):
            print(f"  ADDED core: {f}")
            added += 1
    print(f"\n=== Adding tier: supporting (was missing) ===")
    for f in ADD_TIER_SUPPORTING:
        if set_tier(f, 'supporting'):
            print(f"  ADDED supporting: {f}")
            added += 1
    print(f"\nDone: {promoted} promoted, {added} added")

if __name__ == '__main__':
    main()
