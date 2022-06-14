import * as React from "react";
import { useState } from "react";
import { Box, Input, Slider, Typography, Theme, Tooltip, Button } from "@material-ui/core";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import Help from '@material-ui/icons/Help';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { formatCcy, handleInvalidValue } from "../../../utils";
import { FormControlLabel } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { Server } from "../interfaces/Server";

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
const COST_PER_TARGET = 10;
const HIGH_AVAILABILITY_TARGETS = 100;
const UNLIMITED_TARGETS = 2001;
const UNLIMITED_PRICE = "192,000";

const isChargedTargets = (valueTargets: number | string): boolean => {
    return valueTargets > FREE_TARGETS;
};

const ServerPricing = (props: Server) => {

    // Styling
    const classes = useStyles();

    // Deployment Targets
    const [valueTargets, setValueTargets] = useState((props.selectedUser?.targets) ? props.selectedUser?.targets : FREE_TARGETS);

    // Set last selected presets
    const [lastSelectedUserID, setLastSelectedUserID] = useState(2);
    const [isRecommended, setRecommended] = useState(false);

    // Update pricing based on users team selection
    React.useEffect(() => {
        if ((props.selectedUser?.targets && props.selectedUser?.minutes) && props.selectedUser?.id !== lastSelectedUserID) {
            updateUserTargets(props.selectedUser?.targets);
            setLastSelectedUserID(props.selectedUser?.id);
        }
        if ((props.selectedUser?.recommended) && props.selectedUser?.recommended === "server") {
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

    // High Availablity
    const [LastTargetsSliderVal, setLastTargetsSliderVal] = useState(
        FREE_TARGETS
    );
    const [haCheckboxVal, setHaCheckboxVal] = useState(false);
    const isEligibleHA = valueTargets >= HIGH_AVAILABILITY_TARGETS;
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

    // Unlimited Targets
    const [
        unlimitedTargetsCheckboxVal,
        setUnlimitedTargetsCheckboxVal,
    ] = useState(false);

    // High Availability
    const [
        highAvailabilityCheckboxVal,
        setHighAvailabilityCheckboxVal
    ] = useState(false);

    const isEligibleUnlimited = valueTargets >= UNLIMITED_TARGETS;
    const renderUnlimitedTargetsChecked =
        unlimitedTargetsCheckboxVal || isEligibleUnlimited;

    const isHighAvailability = valueTargets >= 100;
    const renderHighAvailabilityChecked = highAvailabilityCheckboxVal || isHighAvailability;

    const unlimitedTargetsCheck = (e: { target: { checked: any } }) => {
        // Updating checkbox state
        const newUnlimitedTargetsCheckboxVal = e.target.checked;
        setUnlimitedTargetsCheckboxVal(newUnlimitedTargetsCheckboxVal);
        // [ ] => [x]
        if (newUnlimitedTargetsCheckboxVal) {
            // Set unlimited target value
            if (valueTargets < UNLIMITED_TARGETS) {
                setValueTargets(UNLIMITED_TARGETS);
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

    const targetsPrice = calcChargedTargets(valueTargets) * COST_PER_TARGET;
    const totalPrice = targetsPrice;

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
                <h3 className={classes.heading}>Server</h3>
                <p>Octopus on your infrastructure</p>
                <div className="pricing">
                    <p className="price-wrap">
                        <span className="price">
                            {renderUnlimitedTargetsChecked
                                ? UNLIMITED_PRICE
                                : formatCcy(totalPrice)}
                            <sup>*</sup>
                        </span>
                        <span> / Month</span>
                    </p>
                    <p className="text-muted">Local taxes may be applicable</p>
                </div>
                
                {renderUnlimitedTargetsChecked ? null : (
                    <div className="slider-wrap">
                        <div className="tooltip-wrap">
                            <Typography>
                                For{" "}
                                {renderUnlimitedTargetsChecked
                                    ? ` unlimited deployment targets`
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
                                max: 2000,
                                type: "number",
                                "aria-labelledby": "input-slider",
                            }}
                        />
                        <Slider
                            value={valueTargets}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            min={10}
                            max={2000}
                        />
                    </div>
                )}

                <div className="checkbox-wrap">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={renderUnlimitedTargetsChecked}
                                onChange={unlimitedTargetsCheck}
                                name="unlimitedTargets"
                            />
                        }
                        label="Unlimited Targets"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={renderHighAvailabilityChecked}
                                onChange={highAvailabilityCheck}
                                name="highAvailability"
                            />
                        }
                        label="High Availability*"
                    />
                </div>
                <p className="notice">
                    * High availability feature included in plan with more than 100
                    deployment targets.
                </p>
                <Button
                    className="Button"
                    variant="contained"
                    size="large"
                    color="secondary"
                    endIcon={<ChevronRightIcon />}
                    disableElevation
                    onClick={() => {
                        window.location.href = 'https://octopus.com/start?platform=Server';
                    }}>
                    {"Start a trial"}
                </Button>
            </Box>
        </>
    );
};
export default ServerPricing;
