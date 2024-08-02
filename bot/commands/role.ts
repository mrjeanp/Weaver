import { createCommand } from "../lib/Bot";
import { _get, _set, _unset } from "../lib/utils/lodash";

export default createCommand(
  (builder) => {
    return builder
      .setName("role")
      .setDescription("Configure a role")
      .addRoleOption((option) =>
        option.setName("role").setDescription("Role").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("emoji").setDescription("Assign an emoji to the role")
      )
      .setDefaultMemberPermissions(0)
      .setDMPermission(false);
  },
  async (interaction, bot) => {
    if (!interaction.inGuild()) throw "not in guild";

    const response = await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guild?.id!;
    const role = interaction.options.getRole("role")!;
    const emoji = interaction.options.getString("emoji")?.trim();
    const config = bot.config(guildId);
    const data = await config.fetch();

    if (!emoji || /0|null|undefined|false|no/i.test(emoji)) {
      _unset(data, `roles.${role.id}.emoji`);
    } else {
      _set(data, `roles.${role.id}.emoji`, emoji);
    }

    const roleConfig = _get(data, `roles.${role.id}`) ?? {};

    // if the role object has no keys, delete it
    if (!Object.keys(roleConfig).length) {
      _unset(data, `roles.${role.id}`);
    }

    // saveConfig(guildId, data);
    await config.save( data);

    response.edit("Done");
  }
);
