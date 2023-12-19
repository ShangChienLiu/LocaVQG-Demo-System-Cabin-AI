def get_user_input():
    fdt5_question = input("> Please enter the FDT5 model generated: ")
    user_reply = input("> Please enter the user reply: ")
    return fdt5_question, user_reply

def get_observation_based_on_user_reply(fdt_question, user_reply):
    system_prompt = [{"role":"system", "content":get_observation_prompt(fdt_question, user_reply)}]
    response = model.inference(system_prompt)
    return response

def get_reply_based_on_observation(fdt_question, user_reply, observation="", infomation="No infomation appended."):
    system_prompt = [
        { "role":"user", "content":"從現在開始，你不會產生任何問句。接下來的回覆不可以用嗎, 呢,? 或？ 喔，不可以問問題！"},
        { "role":"assistant", "content":"好的，從現在開始，無論如何，我都不會產生任何問句。我接下來的回覆不可以用嗎, 呢,? 或？ 喔！"},
        { "role":"user", "content":"從現在開始，你只會用繁體中文回覆喔！"},
        { "role":"assistant", "content":"好的，從現在開始，無論如何，我只會用繁體中文回覆"},
       { "role":"system", "content":get_reply_based_on_observation_prompt(fdt_question, user_reply, observation, infomation)}
       
        
        ]
    response = model.inference(system_prompt)
    return response

def get_personaility_trait(observations, replys):
    reply_infomations = "Observation historys:\n"
    count = 0
    for observation in observations:
        count +=1
        reply_infomations += f"({count}):{observation}\n"
    count = 0  
    reply_infomations += "User reply historys:\n"
    for reply in replys:
        count +=1
        reply_infomations += f"({count}):{reply}\n"


    system_prompt = [{"role":"system", "content":get_personality_prompt(reply_infomations)}]
    response = model.inference(system_prompt)
    return response

def split_observation_and_response(s):
    # Split the string using regular expression
    parts = re.split(r'\((Observation|Response)\):\s*', s)
    
    observation = ''
    response = ''
    
    # Iterate through the list of strings to populate observation and response
    key = None
    for part in parts:
        if part == 'Observation':
            key = 'Observation'
        elif part == 'Response':
            key = 'Response'
        elif key == 'Observation':
            observation = part
            key = None
        elif key == 'Response':
            response = part
            key = None
            
    return observation, response

def split_observation_and_command(s):
    # Split the string using regular expression
    parts = re.split(r'\((Observation|Command)\):\s*', s)
    
    observation = ''
    command = ''
    
    # Iterate through the list of strings to populate observation and response
    key = None
    for part in parts:
        if part == 'Observation':
            key = 'Observation'
        elif part == 'Command':
            key = 'Command'
        elif key == 'Observation':
            observation = part
            key = None
        elif key == 'Command':
            command = part
            key = None
            
    return observation, command