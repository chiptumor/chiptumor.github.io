const message =
    [
        `This site is reliant on ES modules, which your browser does not support
        (supposed by this script's 'nomodule' attribute, suggesting it should only run
        on browsers that don't support ES modules.)`,
    
        `I'd highly recommend switching to a modern browser, as they are maintained and
        up-to-date with the common browser spec.`,
    
        `If you are worried about security, I'd highly recommend Firefox, as it
        prioritizes privacy and safety, combined with the uBlock Origin extension, which
        blocks requests to unfavorable sites, such as ads or analytics.`,

        `Beware that things may not work right as you venture forward.`
    ]
    .map(string => string.replace(/\s+/g, " "))
    .join("\n\n");

window.alert(message);
