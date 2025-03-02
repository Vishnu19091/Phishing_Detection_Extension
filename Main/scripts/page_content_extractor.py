import requests
from bs4 import BeautifulSoup
import sys

def ltohtml(link):
    if link.startswith("https://") or link.startswith("http://"):
        try:
            r = requests.get(link)
            soup = BeautifulSoup(r.content, "lxml")
            find = soup.find_all('a')
            links = [tag['href'] for tag in find if 'href' in tag.attrs]
            filtered = [link for link in links if link.strip()]

            if not filtered:
                print("No links found on the webpage.")
                return None  # Prevents empty list output

            def filter_links(link):
                return [l for l in link if isinstance(l, str) and ("https://" in l or "http://" in l)]
            
            return filter_links(filtered)

        except requests.RequestException as e:
            print(f"Error fetching the webpage: {e}")
            return None
    else:
        print("Invalid URL. Please provide a valid URL starting with 'http://' or 'https://'.")
        return None


# Run this only if the script is executed directly in the terminal
if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]  # Get the URL from command-line arguments
        result = ltohtml(url)
        if result:
            print("Extracted Links:\n")
            for link in result:
                print(link,end=",\n")
    else:
        print("Usage: python script.py <URL>")
