# AI Service — Qwen 2.5 1.5B Fine-tuned Gym Chatbot

Fine-tuned local LLM chạy song song với Gemini, dùng cho môi trường dev/demo offline không phụ thuộc API key bên thứ ba.

## Setup

```bash
pip install -r requirements.txt
```

## Training (chỉ cần chạy nếu chưa có `gymbot-output/`)

```bash
python train.py
```

Yêu cầu: `faq_merged_final.json` (dataset FAQ), GPU với ít nhất 6GB VRAM (đã test trên RTX 4050 Laptop).

## Chạy inference server

```bash
python serve.py
```

Server chạy tại `http://localhost:5000`.

**Endpoints:**
- `POST /chat` — Body: `{ "message": string, "history": [{role, content}] }` → Response: `{ "reply": string }`
- `GET /health` — Health check

## Export sang GGUF (tùy chọn, dùng với Ollama)

```bash
python export_gguf.py
```

## Known Limitations

- Không có RAG — model trả lời dựa hoàn toàn vào kiến thức đã fine-tune (448 FAQ entries), không truy xuất `KnowledgeBase` như pipeline Gemini
- Chỉ chạy trên máy có GPU compatible CUDA + bitsandbytes
- Không deploy production (Railway không có GPU) — chỉ dùng cho dev/demo local