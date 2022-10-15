import { Repository } from "typeorm";
import { pgDataSource } from "../data_source";
import { SlackService } from "../slack/slack.service";
import { CreateTenantDto } from "./dto/create_tenant.dto";
import { Tenant } from "./tenant.entity";

export class TenantService {
  tenantRepository: Repository<Tenant>;
  constructor() {
    this.tenantRepository = pgDataSource.getRepository(Tenant);
    console.log("Initialized tenant service new");
  }

  async createTenant(createTenantDto: CreateTenantDto) {
    const existingTenant = await this.tenantRepository.findOne({
      where: {
        workspace_id: createTenantDto.workspace_id,
      },
    });
    if (existingTenant) {
      const updatedTenant = await this.tenantRepository.update(
        existingTenant.id,
        {
          access_token: createTenantDto.access_token,
        }
      );

      if (updatedTenant.affected > 0) {
        const tenant = await this.findTenantById(existingTenant.id);
        return tenant;
      }
    }

    const email = await SlackService.getUserEmail(
      createTenantDto.user_slack_id,
      createTenantDto.access_token
    );

    const date = new Date();
    date.setDate(date.getDate() + 21);

    let tenant = this.tenantRepository.create({
      ...createTenantDto,
      email,
      trial_end_date: date.toISOString(),
    });

    let isSuccess = true;
    tenant = await this.tenantRepository.save(tenant).catch((err) => {
      console.error(err);
      isSuccess = false;
      return null;
    });
    if (!isSuccess) {
      return null;
    }
    tenant = await this.findTenantById(tenant.id);
    return isSuccess ? tenant : null;
  }

  async findTenantById(id: string) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        id,
      },
      relations: {
        channels: true,
      },
    });

    return tenant;
  }

  async updateTenant(id: string, dto: Partial<Tenant>) {
    const res = await this.tenantRepository.update(id, {
      ...dto,
    });
    return res.affected > 0 ? true : false;
  }

  async findTenantByEmail(email: string) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        email,
      },
    });

    return tenant;
  }

  async removeSubscription(id: string) {
    const tenant = await this.findTenantById(id);
    this.tenantRepository.update(id, {
      subscription_type: "",
      stripe_subscription_id: "",
      is_paid_plan: false,
      is_trial:
        new Date().getTime() < new Date(tenant.trial_end_date).getTime(),
    });
  }

  async findByWorkspaceId(workspaceId: string) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        workspace_id: workspaceId,
      },
    });

    return tenant;
  }

  async findAll() {
    const tenants = await this.tenantRepository.find();

    return tenants;
  }

  async removeTenant(id: string) {
    const res = await this.tenantRepository.delete(id);
    return res.affected > 0 ? true : false;
  }
}
