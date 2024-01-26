import React, { useMemo } from 'react';
import { belowDesktop, forAnyDesktop, forWideDesktop, useShallowEqualSelector, useThemeDetector } from '../utils';

import CssBaseline from '@mui/material/CssBaseline';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

import { Welcome } from './welcome';
import { Main } from './main';
import { Controls } from './controls';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { W95App } from './win95/app';
import { Capability } from '../services/interfaces/netmd';
import Toc from './factory/factory';

const useStyles = makeStyles()(theme => ({
    layout: {
        width: 'auto',
        height: '100%',
        [forAnyDesktop(theme)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        [forWideDesktop(theme)]: {
            width: 700,
        },
    },

    paper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        height: 'calc(100% - 20px)',
        [forAnyDesktop(theme)]: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1),
            padding: theme.spacing(3),
            height: 200,
        },
        [forWideDesktop(theme)]: {
            height: 250,
        },
    },
    paperShowsList: {
        [forAnyDesktop(theme)]: {
            height: 600,
        },
        [forWideDesktop(theme)]: {
            height: 700,
        },
    },
    paperFullHeight: {
        height: 'calc(100% - 50px)',
    },
    layoutFullWidth: {
        [forAnyDesktop(theme)]: {
            width: '90%',
        },
    },
    bottomBar: {
        display: 'flex',
        alignItems: 'center',
        [belowDesktop(theme)]: {
            flexWrap: 'wrap',
        },
        marginLeft: -theme.spacing(2),
    },
    copyrightTypography: {
        textAlign: 'center',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    minidiscLogo: {
        width: 48,
    },
    controlsContainer: {
        flex: '0 0 auto',
        width: '100%',
        paddingRight: theme.spacing(8),
        [belowDesktop(theme)]: {
            paddingLeft: 0,
        },
    },
}));

const darkBlueTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: '#6ec6ff',
            main: '#2196f3',
            dark: '#0069c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#7d83bd',
            contrastText: '#000',
        }
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: '#6ec6ff',
            main: '#2196f3',
            dark: '#0069c0',
            contrastText: '#fff',
        },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const InternalApp = () => {
    const { mainView, loading, pageFullHeight, pageFullWidth } = useShallowEqualSelector(state => state.appState);
    const { deviceCapabilities } = useShallowEqualSelector(state => state.main);
    const { classes, cx } = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <main className={cx(classes.layout, { [classes.layoutFullWidth]: pageFullWidth })}>
                <Paper
                    className={cx(classes.paper, {
                        [classes.paperShowsList]: deviceCapabilities.includes(Capability.contentList),
                        [classes.paperFullHeight]: pageFullHeight,
                    })}
                >
                    {mainView === 'WELCOME' ? <Welcome /> : null}
                    {mainView === 'MAIN' ? <Main /> : null}
                    {mainView === 'FACTORY' ? <Toc /> : null}

                    <Box className={classes.controlsContainer}>{mainView === 'MAIN' ? <Controls /> : null}</Box>
                </Paper>
                <Typography variant="body2" color="textSecondary" className={classes.copyrightTypography}>
                    {'© '}
                    <Link rel="noopener noreferrer" color="inherit" target="_blank" href="https://stefano.brilli.me/">
                        Stefano Brilli
                    </Link>
                    {', '}
                    <Link rel="noopener noreferrer" color="inherit" target="_blank" href="https://github.com/asivery/">
                        Asivery
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </main>

            {loading ? (
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : null}
        </React.Fragment>
    );
}

const App = () => {
    const { colorTheme, vintageMode } = useShallowEqualSelector(state => state.appState);
    const systemIsDarkTheme = useThemeDetector();

    const theme = useMemo(() => {
        switch (colorTheme) {
            case 'light':
                return lightTheme;
            case 'dark':
                return darkTheme;
            case 'dark-blue':
                return darkBlueTheme;
            case 'system':
                return systemIsDarkTheme ? darkTheme : lightTheme;
        }
    }, [systemIsDarkTheme, colorTheme]);

    if (vintageMode) {
        return <W95App />;
    }

    return (
        <ThemeProvider theme={theme}>
            <InternalApp />
        </ThemeProvider>
    );
};

export default App;
