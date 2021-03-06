import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";

import CameraDialog from "./Components/CameraDialog/CameraDialog"

import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWFjYXB1Y2EiLCJhIjoiY2pnem4wMWRtMDJqZzMxbXd2YTkxbzAzdiJ9.fAmljrg3ipHbRWZY2comOA";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 1,
      lat: 1,
      zoom: 1,
      haveUsersLocation: false,
      cardVisible: true,
      cameraDialogVisible: false,
      lngLat: { lat: null, lng: null },
      cctvType: "",
      filiation: ""
    };
  }
  handleCloseClick = () => {
    this.setState(state => ({ cardVisible: !state.cardVisible }));
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ cameraDialogVisible: false });
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 15.5
        });
        map.flyTo(
          {
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
            speed: 1,
            easing(t) {
              return t;
            }
          },
          updateGeocoderProximity()
        );
      },
      () => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(location => {
            this.setState({
              lat: location.latitude,
              lng: location.longitude,
              zoom: 15.5
            });
            map.flyTo(
              {
                center: [this.state.lng, this.state.lat],
                zoom: this.state.zoom,
                speed: 1,
                easing(t) {
                  return t;
                }
              },
              updateGeocoderProximity()
            );
          });
      }
    );

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: "Buscar"
    });
    map.addControl(geocoder);

    map.addControl(new MapboxLanguage());

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );

    function updateGeocoderProximity(lng, lat) {
      if (lng !== null && lat !== null) {
        geocoder.setProximity({ longitude: lng, latitude: lat });
      } else {
        geocoder.setProximity(null);
      }
    }

    map.on("load", function() {
      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"]
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.6
          }
        },
        labelLayerId
      );
    });

    map.on("move", () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on("moveend", () => {
      const { lng, lat } = map.getCenter();
      updateGeocoderProximity(lng, lat);
    });

    var el = document.createElement("div");
    el.className = "marker";
    el.style.height = "32px";
    el.style.width = "32px";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "center";
    el.style.backgroundSize = "cover";
    el.style.backgroundImage = 'url("https://i.imgur.com/H5kO3O1.png")';

    map.on("click", e => {
      this.setState({ cameraDialogVisible: true, lngLat: e.lngLat });
      console.log(this.state);
      let marker;
      marker = new mapboxgl.Marker({
        draggable: false,
        element: el
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map);
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const { lng, lat, zoom } = this.state;
    const cardVisible = this.state.cardVisible;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          ref={el => (this.mapContainer = el)}
          className="absolute top right left bottom"
        />
        <Fade in={this.state.cardVisible}>
          {cardVisible ? (
            <Card raised={true} className="messeage-form">
              <CardHeader
                title="Mapa do Maroto"
                action={
                  <IconButton
                    onClick={this.handleCloseClick}
                    aria-expanded={this.state.cardVisible}
                    aria-label="Fechar"
                  >
                    <CloseIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography component="p">
                  Um experimento sobre como a vigilância massiva e câmeras de
                  segurança impactam nossa vida.
                  <br />
                  Para começar a mapear, clique em algum local no mapa onde você
                  saiba que há uma câmera e preencha o formulário com as
                  informações dela.
                  <br />
                  <br />
                  Deseja conhecer mais sobre o projeto? Clique Aqui!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <div className="card-ctrl-icon">
              <IconButton
                onClick={this.handleCloseClick}
                aria-expanded={this.state.cardVisible}
                aria-label="Abrir Card"
              >
                <AddIcon />
              </IconButton>
            </div>
          )}
        </Fade>
        <CameraDialog 
          cameraDialogVisible={this.state.cameraDialogVisible} 
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}

export default App;
