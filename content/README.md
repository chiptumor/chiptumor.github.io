# `/content/`

Files within this folder contain content that dynamically or frequently change
outside of feature or fix commits.

## `splash.txt`

`splash.txt` is a text file containing many short strings to use as splash texts
to the bottom-right of the large 3D logo at the top of the main page, a lot like
that of Minecraft's title screen.

### Syntax

In order to be parsed correctly, the content of the file must follow specific
syntax.

#### Line breaks

Each splash is separated by a line break. For example:

```plain text
Soft kitty, warm kitty!
Little ball of fur!
```

The rendered array should look like this:

```json
[
  "Soft kitty, warm kitty!",
  "Little ball of fur!"
]
```

#### Comments

Splashes can include a comment, so long as it is separated from the splash via
two slashes (`//`), similarly to JavaScript. For example:

```plain text
make().some["noise!"]   // JavaScript syntax
```

This is rendered as "make().some["noise!"]"

#### Empty lines

Empty lines between splashes is permitted, especially for readability and
denoting related sections. For example:

```plain text
make().some["noise!"]

Soft kitty, warm kitty!
Little ball of fur!

Shirts Shirts Shirts!
```

The rendered array should look like this:

```json
[
  "make().some[\"noise!\"]",
  "Soft kitty, warm kitty!",
  "Little ball of fur!",
  "Shirts Shirts Shirts!"
]
```

#### Inline HTML

To be used scarcely, splashes can contain HTML, which is rendered appropriately.
For example, a splash colored red can be written as:

```plain text
<span style="color: red;">Spooky and evil!</span>
```

This is rendered as "<span style="color: red;">Spooky and evil!</span>", or
"Spooky and evil!" in red text.

> [!WARNING]
> It is not recommended to use inline color styling in this manner, as the drop
> shadow of the element uses a static color; the given example would color the
> text red, but the drop shadow would remain brown.

### Conventions

While the file must follow syntax to be parsed correctly, conventions should be
considered to keep the file as tidy as possible.

Following these only serves to keep the file as tidy as possible, but the
parsing of the file should not be affected by whether they are followed.

#### String length

Strings must not exceed 40 characters, not counting element syntax. To
demonstrate: (`+` means permitted, `-` means not permitted)

```diff
  #---#---#---#---#---#---#---#---#---#---| Max length without elements
+ Motherfuckin' partay!
+ Motherfuckin' <span class="partay">partay!</span>
- Motherfuckin' partayyyyyyyyyyyyyyyyyyyyyyyy!
- Motherfuckin' <span class="partay">partayyyyyyyyyyyyyyyyyyyyyyyy!</span>
```

To minimize the size of strings that _do_ use element syntax, especially with
attributes such as `style`, ensure the following:

- Whitespace is minimized, e.g.

  ```html
  <span style="color:red">
  ```

- Quotes are not used, if possible, e.g.

  ```html
  <span style=color:red>
  ```

#### Comment content

Each splash should have a comment with context behind it, such as where it came
from or what it references to.

The first part of the comment should specify what it is from or references to.
For example:

```plain text
I'm not takin' no refunds!   // Sample commonly used by FLDE
```

If it would be written beginning with anything along the line of "This splash is
a reference to," treat that part as if implicit. For example:

```plain text
make().some["noise!"]   // JavaScript syntax
```

Note that it does not include anything such as "reference to" or "joke
about"&mdash;that part is implicit.

Additional comments, such as those to specify a misspelling is intentional, can
be separated with a semicolon. For example:

```plain text
Please subscribe for more vidos!   // Remainings video; misspelling intentional
```

#### Inline styling

It's not uncommon for a splash to stand out with inline HTML, but there are some
conflicts that should be considered when taking advantage of this.

Using inline styling to color a splash is not recommended, as the drop shadow of
the splash element uses a static color. I.e. the examples under [Inline
HTML](#inline-html) and [String length](#string-length) would color the text
red, but the drop shadow would remain brown.

## `marquee.xml` and `status.xml`

`marquee.xml` and `status.xml` are used as content for their respective panels
in `/index.html`. As you are likely not me, changes to these files may not
change the content, rather only the formatting or other functionalities.

### Examples of authorized changes

- ```diff
   <?xml version="1.0" encoding="UTF-8"?>
   <status>
  -    <imFeeling>steamed</imFeeling>
  +    <imfeeling>steamed</imfeeling>
       <body>
           <p>"Well, Seymour, I made it... Despite your directions."</p>
           <p>Ah, superintendent Chalmers, welcome!</p>
       </body>
   </status>
  ```

  As this changes the tag name (note the change from `camelCase` to `lowercase`)
  and not anything within the tag's content, this change is authorized.

  (Of course, this is assuming necessary changes are made to the code parsing the
  status.)

- ```diff
   <?xml version="1.0" encoding="UTF-8"?>
   <marquee visible="true">
       <preview>Aurora Borealis</preview>
       <body>
  -        <h2>Ah&mdash;Aurora Borealis!?</h2>
  +        <h2>
  +            Ah&mdash;Aurora Borealis!?
  +        </h2>
           <ul>
               <li>At this time of year,</li>
               <li>At this time of day,</li>
               <li>In this part of the country,</li>
           </ul>
  -        <p>Localized <i>entirely</i> within your kitchen!?</p>
  +        <p>
  +            Localized <i>entirely</i> within your kitchen!?
  +        </p>
       </body>
   </marquee>
  ```

  As this only changes whitespace, which would make no difference in the displayed
  HTML, this change is authorized.

  > [!NOTE]
  > Whitespace changes such as these, especially regarding the content, are not
  > recommended and likely to be closed, but are still authorized.

### Examples of unauthorized changes

- ```diff
   <?xml version="1.0" encoding="UTF-8"?>
   <status>
  -    <imFeeling>steamed</imFeeling>
  +    <imFeeling>tumor-tastic</imFeeling>
       <body>
  -        <p>"Well, Seymour, I made it... Despite your directions."</p>
  -        <p>Ah, superintendent Chalmers, welcome!</p>
  +        <p>There's nothing in the world more awesome than me.</p>
  +        <p>I mean, just think about it!</p>
  +        <p>Do you know any other chiptumors in the world?</p>
       </body>
   </status>
  ```

  As this changes the content&mdash;the `<imFeeling>.textContent` and the
  `<body>.innerHTML`&mdash;this change would be closed as not planned.
