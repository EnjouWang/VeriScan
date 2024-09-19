from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from method.claimVeri import predict
from method.splitDoc import splitDoc
from method.bge_embedding import get_similar_sentence

# create api
app = FastAPI()

# enable CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create item
class Item(BaseModel):
    claim: str
    links: list[str]

# api
@app.get("/")
def home():
    return {"everify": "running"}

@app.post("/everify/")
def everify(item: Item):
    claim = item.claim
    links = item.links
    # doc retrieve
    doc_result = splitDoc(links)
    link = doc_result['link']
    print(link)
    sentence = doc_result['sentence']
    # evidence retrieve
    # evidence = ["A strait in the Persian Gulf separates Qatar from the nearby island country of Bahrain , as well as sharing maritime borders with the United Arab Emirates and Iran ."]
    evidence = get_similar_sentence(claim, sentence)
    # claim veri
    result = predict(claim, evidence)
    
    return {"claim": claim, "evidence": result['evidence'], "label": result['label'], "link": link}

if __name__ == '__main__':
    print('everify')
    result = everify("Qatar is a language", ['https://www.blkgirlsabroad.com/single-post/language-in-qatar','https://www.familysearch.org/en/wiki/Qatar_Languages','https://en.wikipedia.org/wiki/Qatar','https://www.worldatlas.com/articles/what-languages-are-spoken-in-qatar.html','https://www.qatar.georgetown.edu/academics/programs/bsfs-core-curriculum-first-two-years-degree/'])
    print(result)