const childprocess = require('child_process')
var commit = childprocess.spawn('run', ['d']);
commit.stdout.setEncoding('utf8');

var current = '';
commit.stdout.on("data", function(data) {
    current += data;
    console.log(data, `data`)
    if (current[current.length-1] == '\n') {
      console.log(111)
        // Handle text in "current" (this is what commit has written)

        // if we should reply {

            var reply = 'MY REPLY TO WHAT IS IN CURRENT';

            commit.stdin.write(reply + '\n');

        // } else {
            // (if we are finished - have no more replies)
            // commit.stdin.end();
        // }
        current = '';
    }
});
