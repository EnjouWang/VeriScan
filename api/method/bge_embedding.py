from sentence_transformers import SentenceTransformer, util
from tqdm import tqdm

model = SentenceTransformer('./method/contrastive_ckpt_g16')

def get_similar_sentence(claim, sentences):
    print('bge')
    evidences = {}
    for s in tqdm(sentences):
        evidences[s] = cosSimilarity(claim, s, model)
    
    evidences = dict(sorted(evidences.items(), key=lambda item: item[1], reverse=True))
    result = []
    for key, value in evidences.items():
        if value > 0.54:
            result.append(key)
    print(result)
    return result

def cosSimilarity(sent1, sent2, model):
    # if torch.cuda.is_available():
    #     s1_input_ids, s2_input_ids = s1_input_ids.cuda(), s2_input_ids.cuda()
    embeddings_1 = model.encode(sent1, normalize_embeddings=True)
    embeddings_2 = model.encode(sent2, normalize_embeddings=True)
    cos_sim = util.cos_sim(embeddings_1, embeddings_2)
    
    return cos_sim.item()

if __name__ == '__main__':
    model = SentenceTransformer('./contrastive_ckpt_g16')
    claim = "Qatar is a language."
    sentences = ['Qatar,[b] officially the State of Qatar,[c] is a country in West Asia', ' It occupies the Qatar Peninsula on the northeastern coast of the Arabian Peninsula in the Middle East; it shares its sole land border with Saudi Arabia to the south, with the rest of its territory surrounded by the Persian Gulf', ' The Gulf of Bahrain, an inlet of the Persian Gulf, separates Qatar from nearby Bahrain', " The capital is Doha, home to over 80% of the country's inhabitants, and the land area is mostly made up of flat, low-lying desert", 'Qatar has been ruled as a hereditary monarchy by the House of Thani since Mohammed bin Thani signed "an agreement, not a formal treaty"', ' with Britain in 1868 that recognised its separate status', ' Following Ottoman rule, Qatar became a British protectorate in 1916 and gained independence in 1971', ' The current emir is Tamim bin Hamad Al Thani, who holds nearly all executive, legislative, and judicial authority in autocratic manner under the Constitution of Qatar', ' He appoints the prime minister and cabinet', ' The partially-elected Consultative Assembly can block legislation and has a limited ability to dismiss ministers', 'In early 2017, the population of Qatar was 2', '6 million, although only 313,000 of them are Qatari citizens and 2', '3 million being expatriates and migrant workers', ' Its official religion is Islam', ' The country has the fourth-highest GDP (PPP) per capita in the world', ' and the eleventh-highest GNI per capita (Atlas method)', ' It ranks 42nd in the Human Development Index, the third-highest HDI in the Arab world', " It is a high-income economy, backed by the world's third-largest natural gas reserves and oil reserves", " Qatar is one of the world's largest exporters of liquefied natural gas", " and the world's largest emitter of carbon dioxide per capita"]
    evidence = get_similar_sentence(claim, sentences)
    print(evidence)