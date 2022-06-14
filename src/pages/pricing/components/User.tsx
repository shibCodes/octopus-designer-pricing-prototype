import * as React from "react";
import { useState } from "react";
import { Box, Button, Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles, ThemeProvider, createTheme, createStyles } from "@material-ui/core/styles";
import { UserType } from "../interfaces/UserType";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '2px solid white',
        background: '#FFFFFF'
    },
    heading: {
        color: theme.palette.primary.main
    },
    selected: {
        border: '2px solid',
        borderColor: theme.palette.secondary.main
    }
  }),
);

const User = (props: UserType) => {
    const classes = useStyles();

    return (
        <>
            <Box sx={{
                width: 220,
                height: 290,
                boxShadow: '0 8px 16px 0 rgba(0,0,0,.08),0 6px 10px 0 rgba(0,0,0,.02),0 1px 4px 0 rgba(0,0,0,.02)',
                borderRadius: '10px',
                display: 'inline-block',
                textAlign: 'center',
                padding: '1.5rem 1rem 1.5rem 1rem',
                
            }} className={ ((props.selected?.id === props.id) ? classes.selected : 'not-selected') + ' ' + classes.root}>
                <div>
                    <h3 className={classes.heading}>{props.title}</h3>
                    <p>{props.description}</p>
                </div>
                <Button
                    className="Button"
                    variant="contained"
                    size="large"
                    color={ (props.selected?.id === props.id) ? "secondary" : "default"}
                    disableElevation
                    onClick={() => {
                        if (props.id != 0) {
                            props.select!(props);
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        else {
                            window.location.href = 'https://octopus.com/docs/administration/managing-licenses/community';
                        }       
                    }}>
                    { (props.selected?.id === props.id) ? 'Selected' : props.button}
                </Button>
            </Box>
        </>
    );
};
export default User;