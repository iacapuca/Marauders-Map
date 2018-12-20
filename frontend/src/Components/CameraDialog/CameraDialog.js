import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CameraDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraDialogVisible: false,
      camera: {
        name: "",
        location: "",
        type: "",
        visualAngle: "",
        filiation: ""
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cameraDialogVisible !== this.props.cameraDialogVisible) {
      this.setState({cameraDialogVisible: this.props.cameraDialogVisible });
    }
  }

  handleChange = e => {
    this.setState({camera: { ...this.state.camera, [e.target.name]: e.target.value } });
    console.log(this.state);
  };

  handleClose = this.props.handleClose

  handleSubmit = () => {
      console.log(this.state);
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.cameraDialogVisible}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Criar Câmera</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Preencha o formulário abaixo para salvar uma câmera na localização
              escolhida(clicada)
            </DialogContentText>
            <TextField
          autoFocus
          margin="dense"
          required
          placeholder="Dê um nome para a câmera"
          id="name-required"
          label="Nome"
          onChange={this.handleChange}
          inputProps={{
            name: "name",
          }}
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          required
          defaultValue={this.state.lngLat}
          id="location-required"
          label="Localização"
          onChange={this.handleChange}
          inputProps={{
            name: "location",
          }}
          type="text"
          fullWidth
        />
        <FormControl className="cctvType-form">
          <InputLabel htmlFor="cctvType-simple">Tipo de CCTV</InputLabel>
          <Select
            value={this.state.camera.type}
            onChange={this.handleChange}
            inputProps={{
              name: "type",
              id: "cctvType-simple"
            }}
          >
            <MenuItem value="">
              <em>Nenhuma das Opções</em>
            </MenuItem>
            <MenuItem value={"ANPR"}>ANPR</MenuItem>
            <MenuItem value={"Dome"}>Dome</MenuItem>
            <MenuItem value={"Bullet"}>Bullet</MenuItem>
            <MenuItem value={"PTZ"}>PTZ</MenuItem>
            <MenuItem value={"Thermal"}>Thermal</MenuItem>
            <MenuItem value={"Noturna"}>Noturna</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="visualAngle"
          label="Ângulo visual"
          onChange={this.handleChange}
          inputProps={{
            name: "visualAngle",
          }}
          type="number"
          fullWidth
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Filiação</FormLabel>
          <RadioGroup
            aria-label="Filiação"
            name="filiation"
            value={this.state.camera.filiation}
            onChange={this.handleChange}
          >
            <FormControlLabel
              value="Pública"
              control={<Radio />}
              label="Pública"
            />
            <FormControlLabel
              value="Privada"
              control={<Radio />}
              label="Privada"
            />
            <FormControlLabel value="Outro" control={<Radio />} label="Outro" />
          </RadioGroup>
        </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancelar
            </Button>
            <Button
              onClick={this.handleSubmit}
              color="primary"
              variant="contained"
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
