# Home page

The home page is the first page. It shows when the URL has no hash or `#home`.

## Parts

- Hero: a heading, two short paragraphs, the turtle with a speech bubble, and the buttons. All are centered, with the words above the turtle (the human asked for this).
- Main button: "Start lesson 1" for a new child. After that: "Go on: Lesson N, Title" for the first lesson that is not done.
- "Free draw" opens the editor with no lesson (`#free`).
- Progress buttons show only when the child has progress: "Email me my progress" and "Copy my progress link".
- Lesson map: one row per unit. Each lesson is a tile with its number, its title and a small picture of the goal of its last step. A done lesson has a check mark. The first lesson that is not done has a "Next" tag.

## Decisions

- The map replaces the progress dots. The human said dots are too abstract: a child does not see that they are lessons.
- The picture on a tile tells the child "you will draw this". It comes from running the last `solution` of the lesson, so it is always true.
- The text is in the voice of the human's writing (hypermedia.systems), simpler for grade school and high school: "we" and "you", short sentences, a dry joke, one word in italics. The human writes the final text.

## Progress link

- "Email me" opens a `mailto:` link with the progress link in the body. It needs a mail app. "Copy" is the fallback, for example on a school computer with no mail app.
- Opening a `#p=...` link merges the progress (`js/progress.js`), shows what it loaded, and then goes to `#home`.

## In a lesson

The header shows "All lessons" (back to home), the lesson title, and "Lesson N of M, Unit".
