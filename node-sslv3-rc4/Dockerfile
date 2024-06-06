# Build stage for OpenSSL and Node.js
FROM alpine:3.20 as builder

# Install build dependencies
RUN apk update && apk add --no-cache build-base perl curl python3 linux-headers libstdc++

# Set environment variables for versions
ENV NODE_VERSION="22.1.0"
ENV OPENSSL_VERSION="1.1.1t"

# Build OpenSSL
RUN curl -O https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz \
    && tar -xvf openssl-${OPENSSL_VERSION}.tar.gz \
    && cd openssl-${OPENSSL_VERSION} \
    && ./config enable-ssl3 enable-weak-ssl-ciphers \
    && make -j$(nproc) \
    && make install

# Set environment variables to use custom OpenSSL build
ENV LD_LIBRARY_PATH="/usr/local/lib:${LD_LIBRARY_PATH}"

# Build Node.js
RUN curl -O https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}.tar.gz \
    && tar -xvf node-v${NODE_VERSION}.tar.gz \
    && cd node-v${NODE_VERSION} \
    && ./configure --shared-openssl --shared-openssl-includes=/usr/local/include/openssl --shared-openssl-libpath=/usr/local/lib \
    && make -j$(nproc) \
    && make install

# Final stage, using the same base image
FROM alpine:3.20

# Copy the OpenSSL and Node.js runtime from the builder stage
COPY --from=builder /usr/local/ /usr/local/

# Set the entrypoint to Node.js
ENTRYPOINT ["node"]