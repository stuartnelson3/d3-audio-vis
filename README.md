http://angular-audio-player.herokuapp.com/

Audio player connected via websockets. Everyone that joins the site will share the same playlist, and playing and stopping of songs is synchronized across users.

Use https://github.com/stuartnelson3/music-file-server to serve up songs from your users' local machines. Add the server via the "Servers" tab, and then searching from the main tab will check for matches on any servers you have entered. It's important to note that when adding a server on your local machine, make sure you use your network address name (e.g. `my_pc.local:3000`) instead of `localhost:3000`. If you use `localhost`, other users' audio players will attempt to stream the songs from their machine.

There's a visualizer tab in there that will get some love one of these days.
