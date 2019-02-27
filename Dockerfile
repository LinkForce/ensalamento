FROM node:8.12-jessie
LABEL maintainer="horstmannmat <mch15@inf.ufpr.br>"

# Set an environment variable to prevent debian warning.
ENV DEBIAN_FRONTEND noninteractive
ENV LANG C.UTF-8

# Set an environment variable to store where the app is installed to inside of the Docker image.
ENV WORKSPACE /app
RUN mkdir -p $WORKSPACE

# Install apt-utils to prevent warning messages
RUN apt-get -qq update -y && apt-get -qq install -y apt-utils git
# Install necessary libs to compile and run ensalador
RUN apt-get -qq install -y cmake libstdc++6 libyaml-cpp-dev libboost-all-dev --no-install-recommends

RUN git clone --quiet https://github.com/saebyn/munkres-cpp.git /tmp/munkres-cpp && cd /tmp/munkres-cpp && mkdir build && cd build && cmake .. && make && make install && cd /  && rm -rf /tmp/munkres-cpp

# Change WORKSPACE owner
RUN  chown -R node:node $WORKSPACE

# Change running user
USER node
# This sets the context of where commands will be ran in and is documented
# on Docker's website extensively.
# Set app directory
WORKDIR $WORKSPACE

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

# If you are building your code for production
# RUN yarn install --production --frozen-lockfile --silent --non-interactive
RUN  yarn install --frozen-lockfile --silent --non-interactive

## Compile ensalor here
RUN mkdir /app/bin/ &&  mkdir /app/bin/ensalador
COPY --chown=node:node bin/ensalador /app/bin/ensalador
RUN cd /app/bin/ensalador && cmake . && make && cd /app


# Bundle app source
COPY --chown=node:node . .


ENV PATH=$PATH:/app/node_modules/.bin
EXPOSE 3000

ENTRYPOINT ["/app/ensalamento-entrypoint.sh"]

CMD ["DEVELOPMENT"]
