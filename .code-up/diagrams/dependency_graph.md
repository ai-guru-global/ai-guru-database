```mermaid
%%{init: {'theme': 'default'}}%%
graph TD
    title[Module Dependency Graph]
    vllm_utils_py["vllm/utils.py"]:::peripheral
    vllm_entrypoints_openai_api_server_py["vllm/entrypoints/openai/api_server.py"]:::peripheral
    vllm_engine_llm_engine_py["vllm/engine/llm_engine.py"]:::peripheral
    vllm_v1_worker_gpu_model_runner_py["vllm/v1/worker/gpu_model_runner.py"]:::peripheral
    vllm_worker_hpu_model_runner_py["vllm/worker/hpu_model_runner.py"]:::peripheral
    vllm_worker_model_runner_py["vllm/worker/model_runner.py"]:::peripheral
    vllm_v1_engine_core_py["vllm/v1/engine/core.py"]:::peripheral
    vllm_entrypoints_openai_serving_engine_py[".../entrypoints/openai/serving_engine.py"]:::peripheral
    vllm_model_executor_models_qwen2_vl_py["vllm/model_executor/models/qwen2_vl.py"]:::peripheral
    vllm_model_executor_models_mllama_py["vllm/model_executor/models/mllama.py"]:::peripheral
    vllm_model_executor_models_qwen2_5_vl_py["vllm/model_executor/models/qwen2_5_vl.py"]:::peripheral
    vllm_model_executor_layers_fused_moe_layer_py[".../layers/fused_moe/layer.py"]:::peripheral
    vllm_model_executor_models_pixtral_py["vllm/model_executor/models/pixtral.py"]:::peripheral
    vllm_v1_worker_tpu_model_runner_py["vllm/v1/worker/tpu_model_runner.py"]:::peripheral
    vllm_model_executor_models_molmo_py["vllm/model_executor/models/molmo.py"]:::peripheral
    vllm_transformers_utils_config_py["vllm/transformers_utils/config.py"]:::peripheral
    vllm_v1_engine_async_llm_py["vllm/v1/engine/async_llm.py"]:::peripheral
    vllm_engine_arg_utils_py["vllm/engine/arg_utils.py"]:::peripheral
    vllm_model_executor_layers_quantization___init___py[".../layers/quantization/__init__.py"]:::peripheral
    vllm_model_executor_layers_quantization_fp8_py[".../layers/quantization/fp8.py"]:::peripheral
    vllm_model_executor_models_minimax_text_01_py[".../model_executor/models/minimax_text_01.py"]:::peripheral
    vllm_v1_utils_py["vllm/v1/utils.py"]:::peripheral
    vllm_engine_async_llm_engine_py["vllm/engine/async_llm_engine.py"]:::peripheral
    vllm_model_executor_model_loader_tensorizer_py[".../model_executor/model_loader/tensorizer.py"]:::peripheral
    vllm_model_executor_models_minicpmv_py["vllm/model_executor/models/minicpmv.py"]:::peripheral
    vllm_entrypoints_llm_py["vllm/entrypoints/llm.py"]:::peripheral
    vllm_model_executor_models_tarsier_py["vllm/model_executor/models/tarsier.py"]:::peripheral
    vllm_spec_decode_spec_decode_worker_py["vllm/spec_decode/spec_decode_worker.py"]:::peripheral
    vllm_model_executor_models_mllama4_py["vllm/model_executor/models/mllama4.py"]:::peripheral
    vllm_v1_worker_gpu_worker_py["vllm/v1/worker/gpu_worker.py"]:::peripheral
    vllm_distributed_kv_transfer_kv_connector_v1_nixl_connector_py[".../kv_connector/v1/nixl_connector.py"]:::peripheral
    vllm_model_executor_models_chameleon_py["vllm/model_executor/models/chameleon.py"]:::peripheral
    vllm_model_executor_models_kimi_vl_py["vllm/model_executor/models/kimi_vl.py"]:::peripheral
    vllm_model_executor_models_llava_py["vllm/model_executor/models/llava.py"]:::peripheral
    vllm_model_executor_models_qwen_vl_py["vllm/model_executor/models/qwen_vl.py"]:::peripheral
    vllm_engine_multiprocessing_client_py["vllm/engine/multiprocessing/client.py"]:::peripheral
    vllm_entrypoints_chat_utils_py["vllm/entrypoints/chat_utils.py"]:::peripheral
    vllm_model_executor_layers_quantization_compressed_tensors_compressed_tensors_moe_py[".../quantization/compressed_tensors/compressed_tensors_moe.py"]:::peripheral
    vllm_model_executor_model_loader_weight_utils_py[".../model_executor/model_loader/weight_utils.py"]:::peripheral
    vllm_model_executor_models_glm4v_py["vllm/model_executor/models/glm4v.py"]:::peripheral
    vllm_model_executor_models_qwen2_5_omni_thinker_py[".../model_executor/models/qwen2_5_omni_thinker.py"]:::peripheral
    vllm_v1_executor_multiproc_executor_py["vllm/v1/executor/multiproc_executor.py"]:::peripheral
    vllm_worker_worker_py["vllm/worker/worker.py"]:::peripheral
    benchmarks_benchmark_serving_structured_output_py["benchmarks/benchmark_serving_structur..."]:::peripheral
    csrc_quantization_fp4_nvfp4_blockwise_moe_kernel_cu[".../quantization/fp4/nvfp4_blockwise_moe_kernel.cu"]:::peripheral
    vllm_compilation_compiler_interface_py["vllm/compilation/compiler_interface.py"]:::peripheral
    vllm_distributed_parallel_state_py["vllm/distributed/parallel_state.py"]:::peripheral
    vllm_entrypoints_openai_serving_chat_py["vllm/entrypoints/openai/serving_chat.py"]:::peripheral
    vllm_model_executor_model_loader_bitsandbytes_loader_py[".../model_executor/model_loader/bitsandbytes_loader.py"]:::peripheral
    vllm_model_executor_models_aria_py["vllm/model_executor/models/aria.py"]:::peripheral
    classDef core fill:#4a9,stroke:#333,color:white
    classDef peripheral fill:#aaa,stroke:#333,color:white
```