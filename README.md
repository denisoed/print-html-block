# Print Me

In progress...

##  Default options

| Name | Value | Description |
|-|-|-|
| debug | false | show the iframe for debugging |
| importCSS | true | import parent page css |
| importStyle | false | import style tags |
| printContainer | true | print outer container/$.selector |
| loadCSS | "" | path to additional css file - use an array [] for multiple |
| pageTitle | "" | add title to print page |
| removeInline | false | remove inline styles from print elements |
| removeInlineSelector | "*" | custom selectors to filter inline styles. removeInline must be true |
| printDelay | 333 | variable print delay |
| header | null | prefix to html |
| footer | null | postfix to html |
| base | false | preserve the BASE tag or accept a string for the URL |
| formValues | true | preserve input/form values |
| canvas | false | copy canvas content |
| doctypeString | "<!DOCTYPE html>" | enter a different doctype for older markup |
| removeScripts | false | remove script tags from print content |
| copyTagClasses | false | copy classes from the html & body tag |
| beforePrintEvent | null | callback function for printEvent in iframe |
| beforePrint | null | function called before iframe is filled |
| afterPrint | null | function called before iframe is removed |

## Usage

```js
import PrintMe from 'print-me';

<section id="section1">Print Me!</section>
<section id="section2">Don't print me.</section>
<button onclick="print()">Print</button>

function print() {
  const selector = '#section1';
  const options = {
    importStyle: true
  };
  PrintMe(selector, options);
};
```