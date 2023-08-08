---
title: Explanation of execute_async_script in selenium - Non spam post
description: The selenium docs are absolutely terrible. And especially on this method on its WebDriver implementation. What is WebDrive? I'll explain it in one sentence.
draft: false
date: 09-08-23
page_type: post
permalink: "posts/beginner-blender-tutorial-sculpture-part-2"
---



WebDriver: A standard way of controlling browsers remotely. Created by the w3c a web standards non-profit. See: https://www.w3.org/TR/webdriver2/

Various browsers implement these standards to create an API for selenium to operate its "driver" class.

The problem is that selenium's documentation expects you have read the webdriver [standard](https://www.w3.org/TR/webdriver2/). And, wow, you may not have. 



**So when you see this:**

`execute_async_script`(*script: str*, **args*)

Asynchronously Executes JavaScript in the current window/frame.

| Args:  | script: The JavaScript to execute.*args: Any applicable arguments for your JavaScript. |
| :----- | ------------------------------------------------------------ |
| Usage: | `script = "var callback = arguments[arguments.length - 1]; " \         "window.setTimeout(function(){ callback('timeout') }, 3000);" driver.execute_async_script(script)` |

**And wonder what is going on,** you are not alone. To expland this documentation:

- the `args` parameter is a commant separated set of values you can pass to the js script. These are wrapped up into a tuple and then converted into a list. In js the script will access them through a global called `arguments` as an array. 
- **THIS IS IMPORTANT:** The last argument added to the array is the resolve function that let's selenium know when the async function has ended. And it will pass the returned value back to selenium.

