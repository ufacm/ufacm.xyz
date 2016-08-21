'use strict';

const lessons = [
    "The websites you see today are all programmed by <code>&lt;html&gt</code> or <b>H</b>yper <b>T</b>ext <b>M</b>arkup <b>L</b>anguage. HTML provides the skeleton and structure for every singe webpage out there and learning it is the first step to create a website. Press submit to go on. ",
    "What you see below is the skeleton of all HTML pages. Majority of all your code will appear between the body tags! Let's start adding some code.",
    "<code>&lt;h1&gt;</code> and <code>&lt;/h1&gt;</code> through  <code>&lt;h6&gt;</code> and <code>&lt;/h6&gt;</code> are the basic text tags, with <b>h1</b> being the largest and <b>h6</b> being the smallest. Go try it out with <code>&lt;h1&gt;Name Here&lt;/h1&gt;</code>",
    "Awesome! Now let's add a place where you can <b>list</b> your interests. Below your h1 tag, use the h3 tag to give a heading for this new part of your site.",
    "There are two types of list tags you can use in HTML: the <code>&lt;ul&gt</code> or the <code>&lt;ol&gt</code> tag(unordered and ordered, respectively). In this example, you can use either or.",
    "In both cases, you populate your list using list elements via the <code>&lt;li&gt</code> tag. So in between your <code>&lt;ol&gt</code> or <code>&lt;ul&gt</code> tags, add <code>&lt;li&gt</code> tags. An example can be seen on the next slide.",
    "<code>&lt;ol&gt</code><br><code>&lt;li&gt</code>Go UFL ACM!<code>&lt;/li&gt</code><br> <code>&lt;/ol&gt</code>",
    "Have you added your interests? Great! Now let's add a place to display an image of yourself.",
    "The same way you added your list heading, add an image heading with an h3 tag directly below your interests",
    "To add images we use the <code>&lt;img&gt;</code> tag, and it's src attribute to store the link of the images. Example on next slide",
    "Try it out yourself: <code>&lt;img src='http://www.twiisty.com/Uploads/Profile/default_profile_pic.png'&gt;</code>",
    "We're making great progress! But the site looks kind of bland doesn't it. Let's use some CSS to spice things up. Click the CSS tab and let's get started.",
    "Now we have to add some CSS! CSS stands for <b>C</b>ascading <b>S</b>tyle <b>S</b>heet, which adds the design to the sheet.",
    "CSS follows the syntax <code>selector: property:value</code>. For example, if you wanted to make all paragraphs 10 pixels and blue, you would use <code>p{font-size:10px; color: blue;}</code>",
    "Let's center our name first. Use the following code: <code>h1{text-align: center;}</code>",
    "What I  want to do is align all the interests on the left and the image on the right. But then we have to apply the css property on multiple tags. To do this we're going to have to use divs.",
    "Divs act like containers to any of the attributes it surrounds. For example, for the image tag, it would be like so: <code>&lt;div&gt</code><code>&lt;img&gt</code><code>&lt;/div&gt</code> ",
    "Go ahead and do the same for the list portion of the site",
    "But now, how would we specify which part goes on the left and which goes on the right? Let me introduce you to classes and ids.",
    "Classes and Ids are attributes you can add to HTML tags to help identify them.",
    "Classes are used to represent multiple tags with similar properties and can be represented with * in CSS.",
    "Ids are used to represent single tags, with unique properties and they're represented by # in CSS.",
    "Let's use the power of Ids on our webpage. On the div attribute for your interests change it to: <div id='interests'>",
    "Now got back to the CSS tab and add this: <code>#interests{float: right; }</code>",
    "Perfect! Now do the same for your image tag",
    "Now let's practice some JavaScript. Now the same principles you've learned in other languages will apply to JavaScript. What's really cool is how JS can be used to add interactivity to the webpage.",
    "I'll give you a quick example: create a button on the home page using <code>&lt;button onclick='func()'&gt;Click me&lt;/button&gt;</code>",
    "Now in your JavaScript tab add this: <code>function func(){alert('YAY!');}</code>",


];

module.exports = lessons;
