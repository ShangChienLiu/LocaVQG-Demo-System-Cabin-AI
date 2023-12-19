
import threading
from asyncio import Queue
from functools import wraps
from queue import Empty, Queue

import openai
from retry import retry


class TimeoutException(Exception):
    pass


engine_list = [
    "gpt-35-turbo",
    "gpt-4",
    "gpt-4-32k",
]

def timeout(seconds):
    def decorator(function):
        @wraps(function)
        def wrapper(self, *args, **kwargs):
            def worker():
                try:
                    self.queue.put(function(self, *args, **kwargs))
                except Exception as e:
                    self.queue.put(e)

            thread = threading.Thread(target=worker)
            thread.start()
            print(thread)
            thread.join(timeout=seconds)
            
            if thread.is_alive():
                raise TimeoutException('Function exceeded timeout: {} seconds'.format(seconds))
            try:
                return self.queue.get_nowait()
            except Empty:
                raise TimeoutException('Function exceeded timeout: {} seconds'.format(seconds))
        return wrapper
    return decorator
    
class Chatgpt:
    def __init__(self, api_key):
        self.queue = Queue()
        pass

    @retry(delay=1)
    @timeout(20) #20s Timeout
    def inference_gpt4(self, messages):
        output = openai.ChatCompletion.create(
            engine=engine_list[2],
            messages=messages,
            temperature=1
            )
        return output['choices'][0]['message']
    
    @retry(delay=1)
    @timeout(20)
    def inference(self, messages):
        
        output = openai.ChatCompletion.create(
            engine=engine_list[0],
            messages=messages,
            temperature=1
            )
        return output['choices'][0]['message']