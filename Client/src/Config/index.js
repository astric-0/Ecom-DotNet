let config;

const dev = {
    path : route => '/dev/' + route,
    getGoogleClientId : _ => '328729368956-bdjamuqdp87q7kfmttd9na0m9eiihq9d.apps.googleusercontent.com'
}

!config && (config = dev)

export default config;