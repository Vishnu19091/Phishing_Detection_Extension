import requests
from bs4 import BeautifulSoup

def ltohtml(link):
    if "https://" in link or "http://" in link:
        r = requests.get(link)
        soup = BeautifulSoup(r.content, "lxml")
        find = soup.find_all('a')
        links = [tag['href'] for tag in find if 'href' in tag.attrs]
        filtered = [link for link in links if link.strip()]

        def filter_links(link):
            res = []
            for l in link:
                if isinstance(l, str):
                    if "https://" in l or "http://" in l:
                        res.append(l)
            return res

        return filter_links(filtered)
    else:
        exit
