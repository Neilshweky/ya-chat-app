# ya-chat-app

The link to the website: https://ya-chat-app.herokuapp.com
The link to the server: https://ya-chat-app-server.herokuapp.com

You might have to wake them both up for the site to work.

## Bugs

I will admit there are still a few things that are not great about this implementation that I would fix with more time.
1. The Authentication is not very secure. 
2. There is still a few bugs with the socket creating new chats in real-time. It works most of the time.
3. <s>Having the socket open so that chats you don't have open are updated in real-time. Moving the chats up to the top once receiving a message for those chats.</s> Added in the latest commit!
4. Add profile pictures. For right now the default is Tony Deangelo, Defenseman for the New York Rangers.
5. Add an online/last seen feature. This chalked up to having nowhere to put it on the GUI.
