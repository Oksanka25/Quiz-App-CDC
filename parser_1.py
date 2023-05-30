import json
from bs4 import BeautifulSoup

html_file = open('quiz.html', 'r', encoding='utf-8')
soup = BeautifulSoup(html_file, 'html.parser')

cards = []
for card in soup.select('.SetPageTerm-inner'):
    question = card.select_one(
        '.SetPageTerm-smallSide .SetPageTerm-wordText .TermText').text.strip()
    options = card.select_one(
        '.SetPageTerm-smallSide .SetPageTerm-wordText .TermText').find_all('br')
    options = [option.next_sibling.strip() for option in options]
    correct = card.select_one(
        '.SetPageTerm-largeSide .SetPageTerm-definitionText .TermText').text.strip()

    card_dict = {'question': question, 'options': options, 'correct': correct}
    cards.append(card_dict)


with open('volume5.json', 'w', encoding='utf-8') as f:
    json.dump(cards, f, ensure_ascii=False, indent=4)

print(json.dumps(cards, indent=4))

print(len(cards))
