# Python Version: Played in the terminal

import requests
import os
from html import unescape
from random import shuffle

# response = requests.get("https://opentdb.com/api.php?amount=1&category=")

categories = requests.get("https://opentdb.com/api_category.php").json()["trivia_categories"]

def print_categories(categories):
    print(15 * "-" + "CATEGORIES" + 15 * "-")
    for i, obj in enumerate(categories):
        print(f"{i + 1}: {obj['name']}")
        
    return i + 1
    
def get_question(cat):
    response = requests.get("https://opentdb.com/api.php?amount=1&category=" + str(cat))
    question_dict = response.json()['results'][0]
    if (question_dict['type'] == 'boolean'):
        print("True or False: ", end="")
    print(unescape(question_dict['question']))
    if (question_dict['type'] == 'multiple'):
        choices: list = question_dict['incorrect_answers'].copy()
        choices.append(question_dict['correct_answer'])
        shuffle(choices)
        for let, choice in enumerate(choices):
            print(f'{chr(let + 97)}) {unescape(choice)}')
        question_dict.update({"choices" : choices})
    return question_dict

def check_answer(answer, question_dict):
    answer = answer.lower()
    if (question_dict['type'] == 'boolean'):
        return answer == question_dict['correct_answer'][0].lower()
    else:
        return question_dict['correct_answer'] == question_dict['choices'][ord(answer) - 97]


while True:
    maximum = print_categories(categories)
    while True:
        try:
            cat = int(input("Please type in the number corresponding to the category: "))
            if (cat < 1) or (cat > maximum):
                raise Exception
            break
        except:
            print("Invalid category")
        
    os.system('cls')
    question_dict = get_question(cat + 8)
    while True:
        answer = input("Answer: ")
        if len(answer) != 0:
            if question_dict['type'] == 'boolean' and (answer[0].lower() == 't' or answer[0].lower() == 'f'):
                break
            elif question_dict['type'] == 'multiple' and (97 <= ord(answer[0].lower()) <= 100):
                break
        print("Invalid answer")
    if check_answer(answer[0], question_dict):
        print("Correct!")
    else:
        print("Incorrect")
        print(f"Correct answer was: {question_dict['correct_answer']}")
    
    answer = input("Would you like to play again (y/n)?: ").lower()
    if (len(answer) == 0) or (answer[0] != 'y'):
        break
    
        

        

