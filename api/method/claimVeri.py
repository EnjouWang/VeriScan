from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

# load model and ckpt
ckpt_path = "./GFS35_FT_e3_b32.ckpt"
model_name_or_path = "bert-base-uncased"
device = "cuda"

tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
if tokenizer.pad_token_id is None:
    tokenizer.pad_token_id = tokenizer.eos_token_id

model = AutoModelForSequenceClassification.from_pretrained(model_name_or_path, return_dict=True, num_labels=3)
model.load_state_dict(torch.load(ckpt_path))
model = model.to(device)
model.eval()

# predict function
def predict(claim, evidence):
    print('claimVeri')
    if len(evidence) >= 1:
        sent = evidence[0]
    else: sent = ''
    evidence = '[SEP]'.join(evidence)
    with torch.no_grad():
        inputs = tokenizer(claim, evidence, return_tensors="pt", padding=True, truncation=True)
        inputs = {key: inputs[key].to(device) for key in inputs}
        outputs = model(**inputs)
        predictions = torch.argmax(outputs.logits, dim=1).tolist()
        if predictions[0] == 0:
            label = 'SUPPORTS'
        elif predictions[0] == 2:
            label = 'REFUTES'
        else:
            label = 'NOT ENOUGH INFO'

    return {"claim": claim, "evidence": sent, "label": label}