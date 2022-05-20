## Contents

1. [About](#about)
2. [Technologies Used](#technologies-used)
3. [Building and Running](#building-and-running)

## About

This project started with my dissatisfaction with existing apps for organizing
pictures and the like. As someone who's trying to get into digital art, I often
download reference photos or drawings by artists I like. The problem is finding
my favorite photos / drawings again after downloading them.

Existing file / photo managers often let you favorite files, or give them
ratings out of five stars. But both of these schemes have problems. Favoriting
files gives you a binary distinction between "favorites" and "non-favorites." It
doesn't let you distinguish between your absolute favorites, the ones that you
think are pretty good but not amazing, the ones that you like but know they're
not that good if you're being honest, etc. If you mark everything you like a
certain amount as a "favorite," then eventually you'll have so many favorites
that the label of "favorite" doesn't mean anything anymore.

Ratings out of five stars mitigate this somewhat, but the problem is that in the
context of a rating out of five stars, a low rating is considered negative;
rating something one out of five stars usually means you *disliked* it, not that
you only liked it a little bit. If we're talking about rating pictures stored on
your computer, then the fact that you downloaded it at all means that you liked
it to some extent. So the low ratings either become useless, because you're not
going to rate something you liked one or two stars out of five; or else they
become misleading, because you have to designate the low ratings as meaning that
you only liked the picture a little rather than that you disliked it.

My solution actually came from a free manga app called GANMA: It's to let the
user like a file as many times as they want. This way, we can still distinguish
between how much we like each picture, but we don't run into the problem of
five-star rating systems where low ratings are considered negative; after all,
a low like count is still a positive like count.

The name of the project comes from this feature. The term "amateur" originally
meant "lover"; it shifted from "lover," to "one who does something for love
rather than professionally," to "a beginner" or "someone who's bad at
something."

This particular version of this project is being built as a desktop app using
Electron. (I also have another GitHub project called "amateur," without the
"-electron," but that one is more of a proof of concept that I made for a job
interview.) As such, I'm envisioning it as not performing any network activity;
the database will probably be SQLite. However, I'll try to use object-oriented
design and REST principles to keep the possibility of an actual backend server
possible.

## Technologies Used

- React
- Electron
- Babel
- Webpack

For testing:
- Mocha
- Sinon
- JSDOM

## Building and Running

At the moment, there's nothing to actually see, but after cloning the repository
and running `npm install`, you can build the project using `npm run make`, test
it with `npm test`, and run it with `npm start`.
