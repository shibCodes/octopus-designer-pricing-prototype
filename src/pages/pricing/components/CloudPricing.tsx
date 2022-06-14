import * as React from "react";
import { useState } from "react";
import { Box, Input, Slider, Typography, Theme, Button } from "@material-ui/core";
import Help from '@material-ui/icons/Help';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import { formatCcy, handleInvalidValue } from "../../../utils";
import { Cloud } from "../interfaces/Cloud";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            color: theme.palette.primary.main
        },
        selected: {
            border: '2px solid',
            borderColor: theme.palette.secondary.main
        }
    }),
);


const FREE_TARGETS = 10;
const FREE_MINUTES = 100;
const COST_PER_TARGET = 10;
const COST_PER_MINUTE = 0.03;
const HIGH_AVAILABILITY_TARGETS = 100;


const isChargedTargets = (valueTargets: number | string): boolean => {
    return valueTargets > FREE_TARGETS;
};

const isChargedMinutes = (valueMinutes: number | string): boolean => {
    return valueMinutes > FREE_MINUTES;
};

const CloudPricing = (props: Cloud) => {
    const classes = useStyles();

    // Deployment Targets
    const [valueTargets, setValueTargets] = useState((props.selectedUser?.targets) ? props.selectedUser.targets : FREE_TARGETS);

    // Set last selected presets
    const [lastSelectedUserID, setLastSelectedUserID] = useState(2);
    const [isRecommended, setRecommended] = useState(false);

    // Update pricing based on users team selection
    React.useEffect(() => {
        if ((props.selectedUser?.targets && props.selectedUser?.minutes) && props.selectedUser?.id != lastSelectedUserID) {
            updateUserTargets(props.selectedUser?.targets);
            setValidMinutes(props.selectedUser?.minutes);
            setLastSelectedUserID(props.selectedUser?.id);
        }

        if ((props.selectedUser?.recommended) && props.selectedUser?.recommended === "cloud") {
            setRecommended(true);
        }
        else {
            setRecommended(false);
        }
    });

    const handleSliderChange = (event: any, newValue: any) => {
        setValueTargets(newValue);
        setLastTargetsSliderVal(valueTargets);
    };

    const handleBlur = () => {
        if (valueTargets < 0) {
            setValueTargets(0);
        } else if (valueTargets > 10000) {
            setValueTargets(10000);
        }
    };

    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            maxWidth: 250,
            fontSize: theme.typography.pxToRem(12),
            boxShadow: '0 8px 16px 0 rgba(0,0,0,.08),0 6px 10px 0 rgba(0,0,0,.02),0 1px 4px 0 rgba(0,0,0,.02)',
            padding: '0'
        },
    }))(Tooltip);

    // Single spot where targets slider value to be set by the user
    const updateUserTargets = (valueTargets: number) => {
        setValidTargets(valueTargets); // update display value
        setLastTargetsSliderVal(valueTargets); // remember user's last value

        // reset checkbox if targets slider value is not eligible to HA
        if (valueTargets < HIGH_AVAILABILITY_TARGETS) {
            setHaCheckboxVal(false);
        }
    };
    const setValidTargets = (num: number) => {
        let vaildVal = handleInvalidValue(num);
        setValueTargets(vaildVal);
    };

    // Deployment minutes
    const [valueMinutes, setValueMinutes] = useState<
        number | string | Array<number | string>
    >((props.selectedUser?.minutes) ? props.selectedUser.minutes : FREE_MINUTES);

    const handleSliderChangeMinutes = (
        event: any,
        newValueMinutes: number | number[]
    ) => {
        setValueMinutes(newValueMinutes);
    };

    const handleBlurMinutes = () => {
        if (valueMinutes < 0) {
            setValueMinutes(0);
        } else if (valueMinutes > 10000) {
            setValueMinutes(10000);
        }
    };
    const setValidMinutes = (num: number) => {
        let vaildVal = handleInvalidValue(num);
        setValueMinutes(vaildVal);
    };

    // High Availablity
    const [LastTargetsSliderVal, setLastTargetsSliderVal] = useState(
        FREE_TARGETS
    );
    const [haCheckboxVal, setHaCheckboxVal] = useState(false);
    const isEligibleHA = valueTargets >= HIGH_AVAILABILITY_TARGETS;
    const renderHaChecked = haCheckboxVal || isEligibleHA;
    const highAvailabilityCheck = (e: { target: { checked: any } }) => {
        // Updating checkbox state
        const newHaCheckboxVal = e.target.checked;
        setHaCheckboxVal(newHaCheckboxVal);
        // [ ] => [x]
        if (newHaCheckboxVal) {
            // Set high availablility value
            if (valueTargets < HIGH_AVAILABILITY_TARGETS) {
                setValueTargets(HIGH_AVAILABILITY_TARGETS);
            }
        } else {
            // [x] => [ ]
            // Reset to user's last input value
            setValueTargets(LastTargetsSliderVal);
        }
    };

    // Calculations
    const calcChargedTargets = (valueTargets: any) => {
        if (isChargedTargets(valueTargets)) {
            return valueTargets - FREE_TARGETS;
        } else {
            return 0;
        }
    };

    const calcChargedMinutes = (valueMinutes: any) => {
        if (isChargedMinutes(valueMinutes)) {
            return valueMinutes - FREE_MINUTES;
        } else {
            return 0;
        }
    };

    const targetsPrice = calcChargedTargets(valueTargets) * COST_PER_TARGET;
    const minutesPrice = calcChargedMinutes(valueMinutes) * COST_PER_MINUTE;
    const totalPrice = targetsPrice + minutesPrice;

    return (
        <>
            <Box className={"solution-wrap" + ' ' + ((isRecommended) ? classes.selected : "not-selected")} sx={{
                width: 384,
                boxShadow: '0 8px 16px 0 rgba(0,0,0,.08),0 6px 10px 0 rgba(0,0,0,.02),0 1px 4px 0 rgba(0,0,0,.02)',
                borderRadius: '10px',
                display: 'inline-block',
                padding: '3rem 1rem 1.5rem 1rem',
                textAlign: 'center'
            }}>
                <span className={(isRecommended) ? "recommended" : "not-recommended"}>RECOMMENDED</span>
                <h3 className={classes.heading}>Cloud</h3>
                <p>DevOps automation as-a-service</p>
                <div className="pricing">
                    <p>
                        <span className="price">
                            {formatCcy(totalPrice)}
                            <sup>*</sup>
                        </span>
                        <span> / Month</span>
                    </p>
                    <p className="text-muted">Local taxes may be applicable</p>
                </div>
                <div className="slider-wrap">
                    <div className="tooltip-wrap">
                        <Typography>
                            For{" "}
                            {valueTargets <= FREE_TARGETS
                                ? ` up to 10 deployment targets`
                                : " up to " + valueTargets + " deployment targets "}
                        </Typography>
                        <HtmlTooltip placement="right"
                            title={
                                <React.Fragment>
                                    <div className="tooltip-header">
                                        {"What are deployment targets?"}
                                    </div>
                                    <div className="tooltip-content">
                                        <p>{"Deployment targets are the servers and cloud PaaS resources (typically the number of virtual machines that you deploy to."}</p>
                                        <p>{"The first 10 targets per month will be "}<strong>{"free of charge"}</strong>{"."}</p>
                                        <p>{"Every target (after the first 10) comes with "}<strong>{"10 free deployment minutes "}</strong> {"per month."}</p>
                                        <p>{"Each additional target will be charged at "}<strong>{"$10 per month"}</strong>{"."}</p>
                                        <p>{"You will only be charged for the "}<strong>{"targets you use"}</strong> {"in your cloud instance during the month."}</p>

                                    </div>
                                </React.Fragment>
                            }
                        >
                            <span><Help fontSize="small" /></span>
                        </HtmlTooltip>
                    </div>

                    <Input
                        className="Input"
                        value={valueTargets}
                        margin="dense"
                        onChange={(e) =>
                            updateUserTargets(parseInt(e.target.value, 10))
                        }
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 10,
                            max: 5000,
                            type: "number",
                            "aria-labelledby": "input-slider",
                        }}
                    />
                    <Slider
                        value={typeof valueTargets === "number" ? valueTargets : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={10}
                        max={5000}
                    />

                </div>
                <div className="slider-wrap">
                    <div className="tooltip-wrap">
                        <Typography>
                            For{" "}
                            {valueMinutes <= FREE_TARGETS
                                ? ` free deployment minutes `
                                : " " + valueMinutes + " deployment minutes "}
                        </Typography>
                        <HtmlTooltip placement="right"
                            title={
                                <React.Fragment>
                                    <div className="tooltip-header">
                                        {"What are deployment minutes?"}
                                    </div>
                                    <div className="tooltip-content">
                                        <p>{"Deployment minutes is the total of the duration of all deployments during the month."}</p>
                                        <p>{"The average deployment time for one app is "}<strong>{"10 minutes"}</strong>{"."}</p>
                                        <p>{"Deployment minutes are charged at "}<strong>{"$0.03 per minute"}</strong>{"."}</p>

                                    </div>
                                </React.Fragment>
                            }
                        >
                            <span><Help fontSize="small" /></span>
                        </HtmlTooltip>
                    </div>

                    <Input
                        className="Input"
                        value={valueMinutes}
                        margin="dense"
                        onChange={(e) =>
                            setValidMinutes(parseInt(e.target.value, 10))
                        }
                        onBlur={handleBlurMinutes}
                        inputProps={{
                            step: 10,
                            min: 100,
                            max: 10000,
                            type: "number",
                            "aria-labelledby": "input-slider-minutes",
                        }}
                    />
                    <Slider
                        value={typeof valueMinutes === "number" ? valueMinutes : 0}
                        onChange={handleSliderChangeMinutes}
                        aria-labelledby="input-slider-minutes"
                        min={100}
                        max={10000}
                    />
                    <Button
                        className="Button"
                        variant="contained"
                        size="large"
                        color="secondary"
                        endIcon={<ChevronRightIcon />}
                        disableElevation
                        onClick={() => {
                            window.location.href = 'https://octopus.com/start?platform=Cloud';
                        }}>
                        {"Start a trial"}
                    </Button>
                </div>
            </Box>
        </>
    );
};
export default CloudPricing;
