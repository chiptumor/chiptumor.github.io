- refactor directories to prepare for server
  
  ```yaml
  build:
  # build scripts
  src:
    # dynamically generated static files
  static:
    # plain static files
  
  ---
  
  src:
    build-static-files:
      build:
        file:
          # build files
        script:
          # build scripts
      static:
        # plain static files
    ## built static folder
    server:
      file:
        # server files
      script:
        # server scripts
      - index.js
  content:
    # content files
  ```

- join webrings:
  - [The WiiRing](https://wiiring.jeith.com/)
  - [Leaky Homepage Ring](https://melonking.net/free/software/flood)
    - thinkin i might implement a background effect for this, red water-like
      transparent gradient rectangle that extends upward behind the main content
