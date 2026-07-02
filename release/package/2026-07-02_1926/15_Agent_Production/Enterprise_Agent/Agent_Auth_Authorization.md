---
title: "Agent Authentication & Authorization"
tags: [agents, security, authentication, authorization, enterprise, production]
status: complete
last_updated: 2026-07-02
sources: []
---

# Agent Authentication & Authorization

## Overview

Production AI agents require robust identity and access management. Unlike traditional services, agents act **autonomously** on behalf of users, making authentication and authorization critical for security and compliance.

## Agent Identity Model

```
┌──────────────────────────────────────────────────────┐
│                   Identity Hierarchy                   │
│                                                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│  │  User    │    │  Agent   │    │  Service │       │
│  │  Identity│───→│  Identity│───→│  Account │       │
│  └──────────┘    └──────────┘    └──────────┘       │
│       │               │               │               │
│       ▼               ▼               ▼               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│  │  OAuth/  │    │  Agent   │    │  API Key │       │
│  │  SAML    │    │  Token   │    │  / mTLS  │       │
│  └──────────┘    └──────────┘    └──────────┘       │
│                                                       │
│  User delegates → Agent acts → Service authenticates  │
└──────────────────────────────────────────────────────┘
```

### Agent Identity Types

| Type | Description | Use Case |
|------|-------------|----------|
| **User-delegated** | Agent acts on behalf of a specific user | Personal assistant |
| **Service agent** | Agent has its own identity | Background automation |
| **Ephemeral agent** | Short-lived, task-scoped identity | One-off tasks |
| **Fleet agent** | Shared identity for agent fleet | Batch processing |

## Authentication Patterns

### OAuth 2.0 Delegation (User → Agent)

```python
# User authorizes agent with limited scopes
class AgentOAuthFlow:
    def initiate_delegation(self, user_id: str, agent_id: str, scopes: list):
        """User delegates authority to agent with specific scopes."""
        delegation = {
            "user_id": user_id,
            "agent_id": agent_id,
            "scopes": scopes,  # e.g., ["read:email", "write:calendar"]
            "expires_at": datetime.utcnow() + timedelta(hours=1),
            "max_actions": 100,
        }
        token = self.create_delegation_token(delegation)
        return token
    
    def validate_agent_action(self, token: str, required_scope: str):
        """Verify agent has permission for specific action."""
        delegation = self.verify_delegation_token(token)
        if delegation["expires_at"] < datetime.utcnow():
            raise ExpiredTokenError()
        if required_scope not in delegation["scopes"]:
            raise InsufficientScopeError()
        if delegation["max_actions"] <= 0:
            raise QuotaExceededError()
        delegation["max_actions"] -= 1
        return True
```

### API Key Authentication (Service Agents)

```python
import hashlib
import hmac
from datetime import datetime

class AgentAPIKeyAuth:
    def __init__(self):
        self.api_keys = {}  # In production: use secure storage
    
    def create_agent_key(self, agent_id: str, permissions: dict):
        """Create scoped API key for agent."""
        key = f"agent_{secrets.token_urlsafe(32)}"
        self.api_keys[key] = {
            "agent_id": agent_id,
            "permissions": permissions,
            "created_at": datetime.utcnow(),
            "last_used": None,
            "rate_limit": permissions.get("rate_limit", 100),
        }
        return key
    
    def authenticate(self, api_key: str) -> dict:
        """Validate API key and return agent info."""
        if api_key not in self.api_keys:
            raise AuthenticationError("Invalid API key")
        
        key_info = self.api_keys[api_key]
        key_info["last_used"] = datetime.utcnow()
        return key_info
```

### Mutual TLS (mTLS) for Agent-to-Service

```yaml
# Istio mTLS policy for agent services
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: agent-mtls
  namespace: ai-agents
spec:
  mtls:
    mode: STRICT
  selector:
    matchLabels:
      app: ai-agent
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: agent-authz
  namespace: ai-agents
spec:
  selector:
    matchLabels:
      app: tool-service
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/ai-agents/sa/agent-service"]
    to:
    - operation:
        methods: ["POST"]
        paths: ["/api/v1/tools/*"]
```

## Authorization Models

### Role-Based Access Control (RBAC)

```python
class AgentRBAC:
    ROLES = {
        "reader": {
            "permissions": ["read:documents", "read:database"],
            "rate_limit": 100,
        },
        "writer": {
            "permissions": ["read:documents", "write:documents", "read:database"],
            "rate_limit": 50,
        },
        "admin": {
            "permissions": ["*"],
            "rate_limit": 200,
        },
    }
    
    def check_permission(self, agent_role: str, required_permission: str) -> bool:
        role = self.ROLES.get(agent_role)
        if not role:
            return False
        if "*" in role["permissions"]:
            return True
        return required_permission in role["permissions"]
```

### Attribute-Based Access Control (ABAC)

```python
class AgentABAC:
    """Fine-grained authorization based on attributes."""
    
    def evaluate_policy(self, agent: dict, resource: dict, action: str, context: dict):
        policy = {
            "agent.trust_level": agent.get("trust_level", 0),
            "resource.sensitivity": resource.get("sensitivity", "public"),
            "action.risk_level": self.get_risk_level(action),
            "context.time_of_day": datetime.utcnow().hour,
            "context.network": context.get("network", "internal"),
        }
        
        # Policy rules
        rules = [
            # High-sensitivity resources require high-trust agents
            lambda p: p["resource.sensitivity"] != "confidential" or p["agent.trust_level"] >= 8,
            # Write actions require internal network
            lambda p: p["action.risk_level"] != "high" or p["context.network"] == "internal",
            # Off-hours access restricted
            lambda p: 6 <= p["context.time_of_day"] <= 22 or p["agent.trust_level"] >= 9,
        ]
        
        return all(rule(policy) for rule in rules)
```

### Capability-Based Access Control

```python
class AgentCapability:
    """Agents receive unforgeable capability tokens for specific resources."""
    
    def issue_capability(self, agent_id: str, resource: str, actions: list, constraints: dict):
        capability = {
            "agent_id": agent_id,
            "resource": resource,
            "actions": actions,  # ["read", "write", "execute"]
            "constraints": constraints,  # {"max_size_mb": 100, "ttl_hours": 1}
            "issued_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(hours=constraints.get("ttl_hours", 1))).isoformat(),
        }
        # Sign capability with server secret
        capability["signature"] = self.sign(capability)
        return capability
    
    def verify_capability(self, capability: dict, resource: str, action: str):
        if not self.verify_signature(capability):
            raise InvalidCapabilityError("Bad signature")
        if capability["resource"] != resource:
            raise InvalidCapabilityError("Resource mismatch")
        if action not in capability["actions"]:
            raise InvalidCapabilityError("Action not permitted")
        if datetime.fromisoformat(capability["expires_at"]) < datetime.utcnow():
            raise InvalidCapabilityError("Capability expired")
        return True
```

## Tool-Level Authorization

### Tool Permission Registry

```yaml
# agent_tools_permissions.yaml
tools:
  - name: "read_file"
    risk_level: "low"
    required_scopes: ["fs:read"]
    constraints:
      max_file_size_mb: 10
      allowed_extensions: [".txt", ".md", ".json", ".csv"]
  
  - name: "write_file"
    risk_level: "medium"
    required_scopes: ["fs:write"]
    constraints:
      max_file_size_mb: 50
      allowed_paths: ["/workspace/*"]
    requires_confirmation: true
  
  - name: "execute_code"
    risk_level: "high"
    required_scopes: ["code:execute"]
    constraints:
      timeout_seconds: 300
      network_access: false
      filesystem_access: "sandbox_only"
    requires_confirmation: true
  
  - name: "send_email"
    risk_level: "high"
    required_scopes: ["email:send"]
    constraints:
      max_recipients: 5
      requires_user_approval: true
```

### Runtime Tool Authorization

```python
class ToolAuthorizationMiddleware:
    def __init__(self, permission_registry):
        self.registry = permission_registry
    
    async def authorize_tool_call(self, agent_context: dict, tool_name: str, tool_args: dict):
        tool_config = self.registry.get(tool_name)
        if not tool_config:
            raise ToolNotFoundError(f"Unknown tool: {tool_name}")
        
        # Check scopes
        agent_scopes = agent_context.get("scopes", [])
        for required_scope in tool_config["required_scopes"]:
            if required_scope not in agent_scopes:
                raise InsufficientScopeError(f"Missing scope: {required_scope}")
        
        # Check constraints
        for constraint_name, constraint_value in tool_config.get("constraints", {}).items():
            self._check_constraint(constraint_name, constraint_value, tool_args)
        
        # High-risk tools require confirmation
        if tool_config.get("requires_confirmation"):
            if not await self._request_confirmation(agent_context, tool_name, tool_args):
                raise ActionCancelledError("User declined confirmation")
        
        # Log the authorization
        self._log_authorization(agent_context, tool_name, "allowed")
        return True
```

## Human-in-the-Loop Authorization

### Approval Workflow

```python
class HumanApprovalWorkflow:
    """Route high-risk agent actions through human approval."""
    
    RISK_THRESHOLDS = {
        "low": "auto_approve",       # Read operations
        "medium": "auto_approve_with_logging",  # Standard writes
        "high": "require_approval",   # External communications
        "critical": "require_approval",  # Financial, legal
    }
    
    async def request_approval(self, agent_id: str, action: dict):
        risk_level = self.assess_risk(action)
        threshold = self.RISK_THRESHOLDS[risk_level]
        
        if threshold == "auto_approve":
            return True
        elif threshold == "auto_approve_with_logging":
            self.log_action(agent_id, action)
            return True
        else:
            # Send to human reviewer
            approval_request = {
                "agent_id": agent_id,
                "action": action,
                "risk_level": risk_level,
                "requested_at": datetime.utcnow(),
                "expires_at": datetime.utcnow() + timedelta(hours=1),
            }
            
            # Notify via Slack/email/webhook
            await self.notify_reviewer(approval_request)
            
            # Wait for approval (with timeout)
            result = await self.wait_for_decision(approval_request)
            return result["approved"]
```

## Audit & Compliance

### Agent Action Audit Log

```python
class AgentAuditLogger:
    def log_action(self, event: dict):
        audit_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": event["agent_id"],
            "user_id": event.get("user_id"),
            "action": event["action"],
            "resource": event["resource"],
            "result": event["result"],
            "ip_address": event.get("ip_address"),
            "user_agent": event.get("user_agent"),
            "session_id": event.get("session_id"),
            "risk_score": event.get("risk_score"),
        }
        
        # Append to tamper-proof audit log
        self.audit_store.append(audit_entry)
        
        # Real-time alerting for high-risk actions
        if event.get("risk_score", 0) > 0.8:
            self.alert_security_team(audit_entry)
```

### Compliance Requirements

| Regulation | Agent Requirement | Implementation |
|-----------|------------------|----------------|
| GDPR | Data minimization, consent | Scope-limited tokens, opt-in |
| SOC 2 | Access controls, audit logs | RBAC, comprehensive logging |
| HIPAA | PHI access restrictions | ABAC, encryption at rest |
| PCI DSS | Payment data isolation | Dedicated agent identities |
| EU AI Act | Transparency, human oversight | Approval workflows, explainability |

## Implementation Checklist

- [ ] Agent identity management (creation, rotation, revocation)
- [ ] Authentication mechanism (OAuth, API keys, mTLS)
- [ ] Authorization model (RBAC, ABAC, capabilities)
- [ ] Tool-level permission registry
- [ ] Human-in-the-loop for high-risk actions
- [ ] Rate limiting per agent/user
- [ ] Comprehensive audit logging
- [ ] Token rotation and expiry
- [ ] Emergency revocation mechanism
- [ ] Compliance documentation

## Related Topics

- [[Agent_Security_Ethics_AGI]]: Agent security overview
- [[LLM_Security_Complete_Guide]]: LLM security
- [[Guardrails_Production_Guide]]: Safety guardrails
- [[AI_Governance_Compliance_2026]]: Governance framework
