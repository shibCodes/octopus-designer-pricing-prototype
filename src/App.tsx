import React from "react";
import { useState } from "react";
import { createTheme, ThemeProvider, Theme, Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import "./App.scss";
import Cloud from "./pages/pricing/components/CloudPricing";
import Server from "./pages/pricing/components/ServerPricing";
import User from "./pages/pricing/components/User";
import userTypes from "./resources/UserTypes.json";


const theme = createTheme({
    palette: {
        primary: {
            main: '#0d80d8',
        },
        secondary: {
            main: '#00b065',
        },
    }
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: 'center',
        },
        leadText: {
            fontSize: '18px',
            color: '#586978',
            maxWidth: '585px',
            margin: '18px auto 60px auto'
        },
        userTypeWrap: {
            maxWidth: '1000px',
            display: 'flex',
            margin: '40px auto',
            justifyContent: 'space-around'
        },
        solutionWrap: {
            maxWidth: '1000px',
            display: 'flex',
            margin: '40px auto',
            justifyContent: 'space-around'
        }
    }),
);

function App() {
    const classes = useStyles();

    const [selectedUser, selectUser] = useState(undefined);

    let userTypeList: React.ReactElement[] = [];
    userTypes.forEach((type) => {
        userTypeList.push(
            <User
                key={type.id}
                id={type.id}
                title={type.title}
                description={type.description}
                button={type.button}
                targets={type.targets}
                minutes={type.minutes}
                highAvail={type.highAvail}
                recommended={type.recommended}
                select={selectUser}
                selected={selectedUser}
            />
        );
    });

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root} style={{ margin: "50px" }}>
                <h1>Pricing Estimator</h1>
                <p className={classes.leadText}>All Octopus Deploy plans have everything needed for your team to create projects, deploy and promote releases, and achieve continuous delivery for any type of application. Find the right plan for your team below.</p>
                <h2>Who is this estimate for?</h2>
                <div className={classes.userTypeWrap}>
                    {userTypeList}
                </div>
                <div className="down-prompt">
                    <Button 
                        color="primary" 
                        endIcon={<ArrowDropDownCircleIcon/>}disableElevation
                        onClick={() => {
                            window.scrollTo(0, document.body.scrollHeight);
                        }}>
                        {"Let me estimate myself"}
                    </Button>
                </div>
                <div className={classes.solutionWrap}>
                    <Cloud selectedUser={selectedUser} />
                    <Server selectedUser={selectedUser} />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
