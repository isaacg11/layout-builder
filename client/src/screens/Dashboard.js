// libraries
import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import { SketchPicker } from 'react-color';

// UI components
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import Alert from '../components/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../components/Navbar';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// actions
import {
  createLayout,
  deleteLayout,
  getLayouts,
  updateLayout
} from '../actions/layouts';

// helpers
import getAuthToken from '../helpers/getAuthToken';

class Dashboard extends Component {

  state = {
    rectangles: [],
    layouts: [],
    selected: null,
    editing: false,
    color: "1876d1",
    alert: {
      status: "success",
      message: "success"
    },
    newLayoutModalIsOpen: false,
    confirmPromptModalIsOpen: false,
    colorPickerModalIsOpen: false
  }

  async componentDidMount() {

    // check for auth token
    const authToken = getAuthToken();

    // if no auth token found {...}
    if (!authToken) {

      // redirect user to Home page to log in
      return window.location.href = "/";
    }

    // get user info from session token
    const user = JSON.parse(window.atob(authToken.split(".")[1]));

    // get layouts belonging to user
    const layouts = await getLayouts(`owner=${user.id}`);

    // update UI
    this.setState({
      layouts,
      user
    });
  }

  /**
  * Adds a new rectangle to the layout builder
  */
  add() {

    // get current rectangles
    let rectangles = this.state.rectangles;

    // generate UID
    const uid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // add new rectangle to list of current rectangles
    rectangles.push({
      key: uid,
      x: 0,
      y: 0,
      width: 200,
      height: 100,
      color: '#1876d1'
    });

    // update UI
    this.setState({ rectangles });
  }

  /**
  * Removes a rectangle from the layout builder
  */
  remove() {

    // get current rectangles
    let rectangles = this.state.rectangles;

    // find index of currently selected rectangle
    let rectangleIndex = rectangles.findIndex((rect) => rect.key === this.state.selected);

    // remove rectangle from list of rectangles
    rectangles.splice(rectangleIndex, 1);

    // update UI
    this.setState({
      rectangles,
      selected: null
    });
  }

  /**
  * Resets the UI in the layout builder
  */
  reset() {

    // update UI
    this.setState({
      rectangles: [],
      selected: null,
      color: "#1876d1"
    })
  }

  /**
  * Creates a new layout
  */
  async save() {

    // save new layout
    const newLayout = await createLayout({
      owner: this.state.user.id,
      name: this.state.newLayoutName,
      rectangles: []
    });

    const newLayoutModalIsOpen = false;
    let layouts = this.state.layouts;

    // add new layout to list of layouts
    layouts.push(newLayout);

    // update UI
    this.setState({
      layouts,
      newLayoutModalIsOpen,
    });

    this.setLayout(newLayout);
  }

  /**
  * Updates a new layout
  */
  async update(data) {

    // update layout
    const updatedLayout = await updateLayout(
      this.state.currentLayout._id,
      data
    );

    // find index of currently selected rectangle
    const matchIndex = this.state.layouts.findIndex((l) => l._id === this.state.currentLayout._id);
    let layouts = this.state.layouts;

    // replace old layout with newly updated layout
    layouts.splice(matchIndex, 1, updatedLayout);

    // update UI
    this.setState({
      layouts,
      selected: null,
      currentLayout: updatedLayout
    });

    // show success alert
    this.openAlert();
  }

  /**
  * Deletes a layout
  */
  async delete() {

    // delete layout
    await deleteLayout(this.state.currentLayout._id);

    // find index of currently selected rectangle
    const matchIndex = this.state.layouts.findIndex((l) => l._id === this.state.currentLayout._id);
    let layouts = this.state.layouts;

    // remove rectangle from list of rectangles
    layouts.splice(matchIndex, 1);

    // update UI
    this.setState({ layouts }, () => {
      this.setState({
        selected: null,
        currentLayout: null,
        confirmPromptModalIsOpen: false
      })

      // reset layout builder
      this.reset();

      // show success alert
      this.openAlert();
    })
  }

  /**
  * Sets the current layout
  * @param {object} layout new layout to be set
  */
  setLayout(layout) {
    const rectangles = layout.rectangles;
    const currentLayout = layout;
    const selected = null;

    // update UI
    this.setState({
      rectangles,
      currentLayout,
      selected
    });
  }

  /**
  * Opens up a new alert
  * @param {string} status status of the alert ["success", "error", "warning"]
  * @param {string} message alert message
  */
  openAlert(status = "success", message = "success") {

    // render alert
    this.setState({
      alertIsOpen: true,
      alert: {
        status,
        message
      }
    })
  }

  /**
  * Renders a list item
  * @param {object} layout layout to be listed as an item
  */
  renderListItem(layout) {
    const {
      currentLayout,
      editing,
      editedName
    } = this.state;

    // if editing list item {...}
    if (editing === layout._id) {

      // render edit mode UI
      return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #DDDDDD", padding: "15px 0px" }}>
          <TextField
            label="Name"
            variant="standard"
            value={editedName}
            onChange={(e) => this.setState({ editedName: e.target.value })} />
          <div>
            <Tooltip title="Save Changes">
              <Button onClick={async () => {
                await this.update({ name: editedName });
                this.setState({ editing: null });
              }}><CheckIcon style={{ marginLeft: '5px' }} /></Button>
            </Tooltip>
            <Tooltip title="Cancel">
              <Button onClick={() => {
                this.setState({
                  editing: false
                })
              }}><ClearIcon style={{ marginLeft: '5px' }} /></Button>
            </Tooltip>
          </div>
        </div>
      )
    } else {

      // render read-only UI
      return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #DDDDDD" }}>
          <Typography><p style={{ color: "#0072E5", cursor: "pointer", fontWeight: (currentLayout && (currentLayout.name === layout.name)) ? "bold" : "initial" }} onClick={() => this.setLayout(layout)}>{layout.name}</p></Typography>
          <div>
            <Tooltip title="Edit Name">
              <Button onClick={() => {
                this.setState({
                  editing: layout._id,
                  editedName: layout.name
                })

                this.setLayout(layout);
              }}><EditIcon style={{ marginLeft: '5px' }} /></Button>
            </Tooltip>
            <Tooltip title="Delete Layout">
              <Button onClick={() => {
                this.setLayout(layout);
                this.setState({
                  confirmPromptModalIsOpen: true,
                })
              }}><DeleteOutlineIcon style={{ marginLeft: '5px' }} /></Button>
            </Tooltip>
          </div>
        </div>
      )

    }
  }

  render() {

    const {
      rectangles,
      layouts,
      color,
      currentLayout,
      newLayoutName,
      selected,
      alert,
      alertIsOpen,
      newLayoutModalIsOpen,
      confirmPromptModalIsOpen,
      colorPickerModalIsOpen
    } = this.state;

    return (
      <div>

        {/* alert (dynamically visible) */}
        <Alert
          alertIsOpen={alertIsOpen}
          alert={alert}
          onClose={() => this.setState({
            alertIsOpen: false
          })}
        />

        {/* new layout modal (dynamically visible) */}
        <Dialog open={newLayoutModalIsOpen} onClose={() => this.setState({ newLayoutModalIsOpen: false })}>
          <DialogTitle>New Layout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Name your layout, then click the Save & Continue button to start building!
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              id="name"
              label="Layout Name"
              type="text"
              variant="standard"
              onChange={(e) => this.setState({ newLayoutName: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ newLayoutModalIsOpen: false })}>Cancel</Button>
            <Button disabled={!newLayoutName} onClick={() => this.save()}>Save & Continue</Button>
          </DialogActions>
        </Dialog>

        {/* confirm prompt modal (dynamically visible) */}
        <Dialog open={confirmPromptModalIsOpen} onClose={() => this.setState({ confirmPromptModalIsOpen: false })}>
          <DialogTitle>Are You Sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Once you delete "{currentLayout ? currentLayout.name : "layout"}", this action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ confirmPromptModalIsOpen: false })}>Cancel</Button>
            <Button onClick={() => this.delete()}>Delete</Button>
          </DialogActions>
        </Dialog>

        {/* color picker modal (dynamically visible) */}
        <Dialog open={colorPickerModalIsOpen} onClose={() => this.setState({ colorPickerModalIsOpen: false })}>
          <DialogTitle>Color Picker</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select a color to apply to your layout
            </DialogContentText>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "25px" }}>
              <SketchPicker
                color={color}
                onChangeComplete={(val) => {
                  let currentRectangles = this.state.rectangles;
                  currentRectangles.forEach((r) => {
                    if (r.key === this.state.selected) {
                      r.color = val.hex;
                    }
                  })

                  this.setState({
                    rectangles: currentRectangles,
                    color: val.hex
                  });

                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ colorPickerModalIsOpen: false })}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* navbar */}
        <Navbar />

        {/* layout builder */}
        <div style={{ display: "flex", flexDirection: "row", margin: "25px" }}>
          <div style={{
            flex: 2,
            marginRight: "25px"
          }}>
            <div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <Button
                  disabled={!currentLayout}
                  variant="contained"
                  onClick={() => this.update({ rectangles: this.state.rectangles })}
                  style={{ marginRight: "10px" }}>
                  Save<SaveIcon style={{ marginLeft: '5px' }} />
                </Button>
                <div>
                  <Tooltip title="Add Rectangle">
                    <span><Button disabled={!currentLayout} onClick={() => this.add()}><AddCircleOutlineIcon /></Button></span>
                  </Tooltip>
                  <Tooltip title="Remove Rectangle">
                    <span><Button disabled={!currentLayout || !selected} onClick={() => this.remove()}><RemoveCircleOutlineIcon /></Button></span>
                  </Tooltip>
                  <Tooltip title="Change Color">
                    <span><Button disabled={!currentLayout || !selected} onClick={() => this.setState({ colorPickerModalIsOpen: true })}><ColorLensIcon /></Button></span>
                  </Tooltip>
                  <Tooltip title="Reset">
                    <span><Button disabled={!currentLayout} onClick={() => this.reset()}><RestartAltIcon /></Button></span>
                  </Tooltip>
                </div>
              </div>
              <div style={{
                border: "1px solid #DDDDDD",
                borderRadius: '5px',
                backgroundColor: "#EEEEEE",
                width: "100%",
                height: "500px"
              }}
                className="box">
                {rectangles.map((rect, index) => (
                  <div
                    key={index}>
                    <Rnd
                      bounds=".box"
                      size={{ width: rect.width, height: rect.height }}
                      position={{ x: rect.x, y: rect.y }}
                      style={{
                        backgroundColor: rect.color,
                        border: (rect.key === this.state.selected) ? "5px solid #000000" : "none"
                      }}
                      onDragStop={(e, d) => {
                        let currentRectangles = this.state.rectangles;
                        currentRectangles.forEach((r) => {
                          if (r.key === rect.key) {
                            r.x = d.x;
                            r.y = d.y;
                          }
                        })

                        this.setState({
                          selected: rect.key,
                          rectangles: currentRectangles
                        });
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {

                        let currentRectangles = this.state.rectangles;
                        let width = rect.width;
                        let height = rect.height;

                        if (
                          direction === 'right' ||
                          direction === 'left'
                        ) {
                          width = ref.offsetWidth;
                        } else if (
                          direction === 'top' ||
                          direction === 'bottom'
                        ) {
                          height = ref.offsetHeight;
                        } else if (
                          direction === 'topRight' ||
                          direction === 'bottomRight' ||
                          direction === 'topLeft' ||
                          direction === 'bottomLeft'
                        ) {
                          width = ref.offsetWidth;
                          height = ref.offsetHeight;
                        }

                        currentRectangles.forEach((r) => {
                          if (r.key === rect.key) {
                            r.width = width;
                            r.height = height;
                            r.x = position.x;
                            r.y = position.y;
                          }
                        })

                        this.setState({
                          selected: rect.key,
                          rectangles: currentRectangles
                        });
                      }}
                    >
                    </Rnd>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Card style={{ width: "100%", minHeight: "500px", flex: 1, padding: "25px" }}>
            <h4><Typography>Layouts</Typography></h4>
            {layouts.map((layout, index) => (
              <div key={index}>
                {this.renderListItem(layout)}
              </div>
            ))}
            <Button
              fullWidth
              variant="contained"
              onClick={() => this.setState({ newLayoutModalIsOpen: true })}>New Layout<AddIcon style={{ marginLeft: '5px' }} /></Button>
          </Card>
        </div>
      </div>
    )
  }
}

export default Dashboard;
