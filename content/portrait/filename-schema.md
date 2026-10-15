# Filename Schema

Each filename under `./image/` should match the following RegEx pattern:

```javascript
/^(?<platform>.+?)-(?<username>.+?)-(?:(?<reason>.+?_(?<index>\d+?))?|(?<id>.+?))\.(?<extension>.+)$/
```

Or, simpler put, it should obey the rules that follow.

- If both the source article and artist alias can be specified, it should match
  the following format:

  ```
  <platform>-<username>-<id>.<extension>
  ```

  Where:

  - __`platform`__ is the social platform that the article can be found on, all
  lowercase (see ["Social Platform Legend"](#social-platform-legend))
  - __`username`__ is the artist's technical alias, such as their username, on
  that social platform, case-sensitive
  - __`id`__ is the source article's unique ID on the social platform,
  case-sensitive

  For example, given the following source article URL:

  ```
  https://x.com/AltyFault/status/2083945928407544258.png
  ```

  The image should use the following filename:

  ```
  twitter-AltyFault-2083945928407544258.png
  ```

- If the source article cannot be specified, in place of `id`, the reason for
  such should be specified (with the shortest word count possible) instead,
  along with an index, for the sake of multiple images that would have the same
  file name due to the identity of a keyword in place of a unique ID.

  ```
  <platform>-<username>-<reason>_<index>.<extension>
  ```

  For example, given the artist at [x.com/AltyFault](<https://x.com/AltyFault>)
  has two images whose sources are lost:

  ```
  twitter-AltyFault-unknown_0.png
  twitter-AltyFault-unknown_1.png
  ```

- For each of the social platform and artist alias, if it cannot be specified,
  the reason for such should be used instead.
