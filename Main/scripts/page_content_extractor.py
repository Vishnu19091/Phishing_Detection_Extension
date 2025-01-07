import requests
from bs4 import BeautifulSoup

def ltohtml(link:str):
    if type(link)!=str:
        print(f"{link} is of {type(link)} is not accepted, try string")
        exit
    else:
        if "https://" or "http://" in link:
            r=requests.get(link)
            soup=BeautifulSoup(r.content,"lxml")
            find=soup.find_all('a')
            links=[tag['href'] for tag in find]
            filtered=[link for link in links if link.strip()]

            def filter_links(link):
                res=[]
                for l in link:
                    if isinstance(l,str):
                        if "https://" or "http" not in l:
                            pass
                        else:
                            res.append(l)
                return res
            return filter_links(filtered)
            
        else:
            print("Invalid Link, try with \'https://\' or \'http://\' ")
            exit
