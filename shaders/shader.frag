#version 450

layout (location = 0) in vec3 f_position;
layout (location = 1) in vec3 f_normal;
layout (location = 2) in vec2 f_uv;

layout (location = 0) out vec4 final_color;

layout (binding = 1, std140) uniform ModelUniforms {
	mat4 model;
	vec3 albedo_color;
};

layout (binding = 2) uniform sampler2D textureSampler;

void main() {
	vec4 texture_color = texture(textureSampler, f_uv);
	final_color = texture_color * vec4(albedo_color, 1.0f);
}
