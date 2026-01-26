---
layout: post
title: "Baby Steps Into AI: Moving Beyond the Chat Interface"
date: 2026-01-26
---

### From Chatting to Integrating AI

> **Chatting with AI is fun.  
> Integrating AI is engineering.**

After spending some time in the ChatGPT interface, I realized something important:  
if I really want to learn AI engineering, I can’t stay in the chat window forever.


### 🚶 A Small First Step

So I took a small step.

I topped up **$5**, generated an API key, and sent my first request programmatically.

Here’s the simplest Node.js example I tried:

📘 **Docs**: [https://platform.openai.com/docs/guides/text](https://platform.openai.com/docs/guides/text)

```js
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5-nano",
  input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);
````
 

### 💸 The Surprise

What surprised me most was the cost.

After a couple of hours of experimenting, it all added up to **about five cents**.
That’s a pretty low price for learning something new.

 

### 🔄 The Shift

This is where AI stops being a chat experience
and starts becoming part of real software.

 

**Small steps.**

**Real integration.**

**Learning by building.**
