import { ref } from "vue"
import { useDb } from "./useDb"
import { ChatModule } from "@mlc-ai/web-llm"
import { useRoute, useRouter } from "vue-router"
import type { GenerateProgressCallback } from "../../../../libs/web-llm/src/types"

export const useLLM = () => {
    const db = useDb()
    
    const baseUrl = "http://localhost:4200"
    let chat = new ChatModule


    const availableModels = [
      {
        local_id: "Nous-Hermes-Llama2-13b-q4f16_1",
        model_url: baseUrl + "/models/Nous-Hermes-Llama2-13b-q4f16_1/params/",
        required_features: ['shader-f16'],
        conv_template: 'llama-2'
      },
      {
        local_id: "RedPajama-INCITE-Chat-3B-v1-q4f16_1",
        model_url: baseUrl + "/models/RedPajama-INCITE-Chat-3B-v1-q4f16_1/params/",
        required_features: ['shader-f16'],
        conv_template: 'redpajama_chat'
      },
      {
        local_id: "RedPajama-INCITE-Chat-3B-v1-q4f32_0",
        model_url: baseUrl + "/models/RedPajama-INCITE-Chat-3B-v1-q4f32_0/params/",
        conv_template: 'redpajama_chat'
      },
      {
        local_id: "Llama-2-7b-chat-hf-q4f16_1",
        model_url: baseUrl + "/models/Llama-2-7b-chat-hf-q4f16_1/params/",
        required_features: ['shader-f16'],
        conv_template: 'llama-2'
      },
      {
        local_id: "vicuna-7b-v1.5-16k-q4f16_1",
        model_url: baseUrl + "/models/vicuna-7b-v1.5-16k-q4f16_1/params/",
        required_features: ['shader-f16'],
        conv_template: 'vicuna_v1.1'
      },
    ]
  
    let modelWasmMap: Record<string, string> = {}
    availableModels.forEach(model => {
      modelWasmMap[model.local_id] = baseUrl + `/models/${model.local_id}/${model.local_id}-webgpu.wasm`
    })

    const unloadModel = async () => {
      await chat.unload()
    }
  
    // Load a model 
    const loadModel = async (model_id: string, onModelLoadingCb?: (report) => void) => {
      await chat.unload()
      if(onModelLoadingCb)
        chat.setInitProgressCallback(onModelLoadingCb);
      
      const currentModel = availableModels.find(m => m.local_id == model_id)
      console.log('load chat', onModelLoadingCb)
      await chat.reload(model_id, { conv_template: currentModel?.conv_template, conv_config: {
      } }, {
        model_list: availableModels,
        model_lib_map: modelWasmMap,
      })
    }
    
    const infer = async (text: string, cb: GenerateProgressCallback) => {
      await chat.generate(text, cb)
    }

    const getResponse = () => {

    }
    
    return {
        loadModel,
        unloadModel,
        infer,
        getResponse 
    }
}