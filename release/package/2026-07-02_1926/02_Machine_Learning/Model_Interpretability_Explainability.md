---
title: "Model Interpretability & Explainability"
tags: [ml, interpretability, explainability, shap, lime, production]
status: complete
last_updated: 2026-07-02
sources: []
---

# Model Interpretability & Explainability

## Why Interpretability Matters

| Driver | Description |
|--------|-------------|
| **Regulatory** | GDPR "right to explanation", EU AI Act high-risk requirements |
| **Trust** | Users need to understand model decisions |
| **Debugging** | Find model failures and biases |
| **Fairness** | Ensure equitable treatment across groups |
| **Safety** | Understand failure modes in critical applications |

## Taxonomy

```
Interpretability Methods
├── Intrinsic (Model is inherently interpretable)
│   ├── Linear/Logistic Regression
│   ├── Decision Trees
│   ├── Rule Lists
│   └── Generalized Additive Models (GAMs)
├── Post-Hoc (Explain after training)
│   ├── Model-Agnostic
│   │   ├── SHAP
│   │   ├── LIME
│   │   ├── Partial Dependence Plots
│   │   └── Permutation Importance
│   ├── Model-Specific
│   │   ├── Attention Visualization (Transformers)
│   │   ├── Gradient-based (Saliency Maps)
│   │   ├── Integrated Gradients
│   │   └── CAM/Grad-CAM (CNNs)
│   └── Example-Based
│       ├── Counterfactual Explanations
│       ├── Nearest Neighbors
│       └── Prototypes & Criticisms
└── Mechanistic Interpretability
    ├── Circuit Analysis
    ├── Probing Classifiers
    └── Feature Visualization
```

## SHAP (SHapley Additive exPlanations)

```python
import shap

# Tree-based models (fast)
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Deep learning models
explainer = shap.DeepExplainer(model, background_data)
shap_values = explainer.shap_values(X_test)

# Any model (KernelSHAP, slower)
explainer = shap.KernelExplainer(model.predict, background_data)
shap_values = explainer.shap_values(X_test)

# Visualization
shap.summary_plot(shap_values, X_test)
shap.waterfall_plot(shap_values[0])  # Single prediction
shap.dependence_plot("feature_name", shap_values, X_test)
```

### SHAP for LLM Text Explanations

```python
import shap

# Explain LLM predictions
explainer = shap.Explainer(
    lambda x: model.generate(x),
    tokenizer,
    output_names=["negative", "positive"]
)

shap_values = explainer(["This movie was great!", "Terrible film."])
shap.plots.text(shap_values[0])
```

## LIME (Local Interpretable Model-agnostic Explanations)

```python
from lime.lime_text import LimeTextExplainer

explainer = LimeTextExplainer(class_names=["negative", "positive"])

def predict_proba(texts):
    # Convert texts to model inputs and get probabilities
    return model.predict_proba(texts)

explanation = explainer.explain_instance(
    "This product is amazing and works perfectly",
    predict_proba,
    num_features=10,
    num_samples=1000
)

# Visualize
explanation.show_in_notebook()
```

## Attention Visualization

```python
from transformers import AutoModel, AutoTokenizer
import torch

model = AutoModel.from_pretrained("bert-base-uncased", output_attentions=True)
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

inputs = tokenizer("The cat sat on the mat", return_tensors="pt")
outputs = model(**inputs)

# attentions: tuple of (num_layers, batch, num_heads, seq_len, seq_len)
attentions = outputs.attentions

# Average attention across heads for last layer
avg_attention = attentions[-1][0].mean(dim=0)

# Visualize
import seaborn as sns
import matplotlib.pyplot as plt

tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
sns.heatmap(avg_attention.detach().numpy(), 
            xticklabels=tokens, yticklabels=tokens)
plt.title("Attention Weights (Last Layer, Averaged Heads)")
plt.show()
```

## Gradient-Based Explanations

### Saliency Maps (Vision)

```python
def saliency_map(model, image, target_class):
    """Compute gradient of output w.r.t. input."""
    image.requires_grad_(True)
    output = model(image)
    output[0, target_class].backward()
    
    saliency = image.grad.data.abs().squeeze()
    return saliency
```

### Integrated Gradients

```python
def integrated_gradients(model, input_tensor, target_class, 
                         baseline=None, steps=50):
    """Axiomatically grounded attribution method."""
    if baseline is None:
        baseline = torch.zeros_like(input_tensor)
    
    # Interpolate between baseline and input
    alphas = torch.linspace(0, 1, steps + 1).reshape(-1, 1, 1, 1)
    interpolated = baseline + alphas * (input_tensor - baseline)
    
    # Compute gradients at each step
    gradients = []
    for i in range(steps + 1):
        x = interpolated[i:i+1].requires_grad_(True)
        output = model(x)
        output[0, target_class].backward()
        gradients.append(x.grad.data)
    
    # Average gradients and multiply by input difference
    avg_gradients = torch.stack(gradients).mean(dim=0)
    integrated_grads = (input_tensor - baseline) * avg_gradients
    
    return integrated_grads
```

### Grad-CAM (Vision)

```python
def grad_cam(model, image, target_class, target_layer):
    """Gradient-weighted Class Activation Mapping."""
    activations = []
    gradients = []
    
    def forward_hook(module, input, output):
        activations.append(output.detach())
    
    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0].detach())
    
    # Register hooks
    handle_fwd = target_layer.register_forward_hook(forward_hook)
    handle_bwd = target_layer.register_full_backward_hook(backward_hook)
    
    # Forward and backward
    output = model(image)
    output[0, target_class].backward()
    
    # Compute Grad-CAM
    activation = activations[0]
    gradient = gradients[0]
    weights = gradient.mean(dim=(2, 3), keepdim=True)
    cam = (weights * activation).sum(dim=1, keepdim=True)
    cam = F.relu(cam)
    cam = cam / cam.max()
    
    # Cleanup
    handle_fwd.remove()
    handle_bwd.remove()
    
    return cam
```

## Counterfactual Explanations

```python
class CounterfactualExplainer:
    """Find minimal change to flip prediction."""
    
    def explain(self, model, instance, target_class, max_iter=1000):
        counterfactual = instance.clone()
        
        for _ in range(max_iter):
            prediction = model(counterfactual)
            if prediction.argmax() == target_class:
                return counterfactual
            
            # Gradient-based perturbation
            loss = -prediction[0, target_class]
            loss.backward()
            
            with torch.no_grad():
                counterfactual -= 0.01 * counterfactual.grad
                counterfactual = torch.clamp(counterfactual, 0, 1)
            counterfactual.requires_grad_(True)
        
        return counterfactual  # Best effort
```

## LLM Mechanistic Interpretability

### Probing Classifiers

```python
class LinearProbe(nn.Module):
    """Train linear probe on internal representations."""
    
    def __init__(self, hidden_dim, num_classes):
        super().__init__()
        self.linear = nn.Linear(hidden_dim, num_classes)
    
    def forward(self, hidden_states):
        return self.linear(hidden_states.detach())

# Extract hidden states from each layer
def extract_probes(model, tokenizer, texts, layer_indices):
    """Train probes on each layer's representations."""
    probes = {}
    for layer_idx in layer_indices:
        hidden_states = extract_layer_outputs(model, tokenizer, texts, layer_idx)
        probe = LinearProbe(hidden_states.shape[-1], num_classes)
        train_probe(probe, hidden_states, labels)
        probes[layer_idx] = probe
    return probes
```

### Feature Visualization

```python
def visualize_features(model, layer, channel, steps=1000):
    """Maximize activation of specific neuron/channel."""
    image = torch.randn(1, 3, 224, 224, requires_grad=True)
    optimizer = torch.optim.Adam([image], lr=0.05)
    
    for _ in range(steps):
        activation = get_activation(model, layer, image)
        loss = -activation[0, channel].mean()  # Maximize activation
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        
        # Regularize for natural-looking images
        with torch.no_grad():
            image.clamp_(0, 1)
    
    return image
```

## Production Deployment

### Explainability API

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/explain")
async def explain_prediction(request: ExplainRequest):
    # Get model prediction
    prediction = model.predict(request.features)
    
    # Generate explanation
    if request.method == "shap":
        explanation = shap_explainer(request.features)
    elif request.method == "lime":
        explanation = lime_explainer(request.features)
    elif request.method == "counterfactual":
        explanation = counterfactual_explainer(request.features)
    
    return {
        "prediction": prediction,
        "explanation": explanation.to_dict(),
        "confidence": float(prediction.max()),
        "method": request.method
    }
```

### Monitoring Explainability

```python
def monitor_explanations(predictions, explanations, threshold=0.1):
    """Alert if explanation patterns shift significantly."""
    baseline_shap = load_baseline_shap_values()
    
    for pred, expl in zip(predictions, explanations):
        current_shap = expl["shap_values"]
        drift = compute_shap_drift(baseline_shap, current_shap)
        
        if drift > threshold:
            alert(f"Explanation drift detected: {drift:.3f}")
            log_explanation_anomaly(pred, expl)
```

## Comparison of Methods

| Method | Scope | Speed | Faithfulness | Human-Readable |
|--------|-------|-------|-------------|----------------|
| SHAP | Global + Local | Slow | High | Medium |
| LIME | Local | Medium | Medium | High |
| Attention | Local | Fast | Low | High |
| Integrated Gradients | Local | Medium | High | Medium |
| Grad-CAM | Local (vision) | Fast | Medium | High |
| Counterfactual | Local | Slow | High | High |
| Probing | Global | Fast | Medium | Low |

## Related Topics

- [[Fairness_Evaluation_for_dummy]]: Fairness metrics
- [[AI_Red_Teaming_Guide]]: Finding model failures
- [[Safety_Evaluation_Framework]]: Safety assessment
- [[Model_Evaluation]]: General evaluation
