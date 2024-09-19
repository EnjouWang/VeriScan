import requests
import re
from bs4 import BeautifulSoup

def splitDoc(links):
    print('splitDoc')
    sentence = []
    link = ''
    for link in links:
        # link = 'https://en.wikipedia.org/wiki/Qatar'
        if link.find('wikipedia') != -1:
            web = requests.get(link)
            soup = BeautifulSoup(web.text, 'html.parser')
            doc = wikiParse(soup)
            ss = re.split(r'[?!\.\t\n]|[\[[0-9]+\]]*', doc)
            ss = list(filter(None, ss)) 
            sentence.extend(ss)      
            break

    print(sentence[0:20])
    print(link)
    return {"sentence": sentence, "link": link}

def wikiParse(soup):
    doc = ""
    content_block = soup.find(class_='mw-content-ltr mw-parser-output')
    content = content_block.find_all('p')
    for c in content:
        if(c.text != ""):
            doc += c.text
    return doc

if __name__ == '__main__':
    print("splitDoc")
    splitDoc(['https://en.wikipedia.org/wiki/Qatar'])