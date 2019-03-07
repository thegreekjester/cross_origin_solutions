# Cross Origin Solutions

This is a compilation of solutions to effectively gather data when running cross-origin experiments via Optimizely

## Usage

**When using any of these scripts, place them into project JS**

event_saver.js 
- This is for saving click events that would otherwise drop across origins
- It scans the window.optimizely object for click events and appends their event ID as well as the endUserId to elements href (if it has one)
- On the subsequent domain, the event is dispatched so as to ensure that the event never gets lost (only use for unique conversions)

link_decoration.js
- This is for automatically appending the endUserId value to href's that lead to anyone of the predefined domains 
- Update the domains array with any domains the experiment spans (similar to GA or waitForOriginSync)
- On the subsequent domain, the cookie is re-written to that value if it doesn't already match

window_name_solution.js 
- Writes local storage to the window.name property
- On the subsequent domain, the local storage is transferred from window.name to the current domains browser memory
- This brings over all bucketing decisions from the previous domains as well as custom attributes
- It also sets the cookie to be consistent as well (similar to link_decoration)

localstorage_cleanup.js
- Use this when local storage frequently exceeds the 10 MB threshold per origin and is causing problems
- This checks for the local storage size, if its above a certain threshold, it will disable cross origin file sharing and delete all Optimizely related data



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
