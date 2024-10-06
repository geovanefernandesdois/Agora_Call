import DuoIcon from "@mui/icons-material/Duo";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <DuoIcon sx={{ color: "white", width: "50px", height: "50px" }} />
      <Typography variant="h1" sx={{ color: "white", fontSize: "36pt" }}>
        Agora Virtual Call
      </Typography>
      <Avatar
        alt="Remy Sharp"
        src="https://thumbs.dreamstime.com/b/imagem-do-perfil-trabalhador-masculino-caucasiano-que-se-posiciona-no-escrit%C3%B3rio-jovem-feliz-olha-para-c%C3%A2mera-coloca-local-de-190186649.jpg"
        sx={{}}
      />
    </div>
  );
};

export default Header;
