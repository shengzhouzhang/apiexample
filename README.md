twitter apis
=======
#features
login / logout
timeline (home)
send tweets
parse tweet-entities
load user profile / background
auto-refresh (30 seconds)
offline / local storage (when reach twitter request limits, switch to offline version)

#structures

|
|-css
|
|-scripts
|  |
|  |-libs		jquery, backbone, underscore, bootstrap
|  |-models	
|  |-apis
|    |
|    |-twitter.js	3-legged oauth, user, timeline request
|    |-oauth
|      |
|      |-support	sha1, signature…
|        |
|        |-https.js    xmlhttprequest
|
|-views
|
|-index.html

#issues
1. you need to disable browser's security to allow cross domain requests.
