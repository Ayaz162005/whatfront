import { makeStyles } from "@material-ui/core";
import { Theme } from "@mui/material";

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: "black",
    height: "100%",
  },
}));

export default function ProfilePart() {
  const classes = useStyle();
  return <div className={classes.root}>ProfilePart</div>;
}
